import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "../../../assets/ikonice/arrow_icon.svg";
import { TicketManager } from "./TicketManager";
import { ApproveTicketSale } from "./ApproveTicketSale";
import { hrTimeFormat } from "../../../components/helper/timeFormat";

export const CheckTicketsCard = ({ data, concertId, reseller_id }) => {
  const [dropdown, setDropdown] = useState(false);
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [arrowDisabled, disableArrow] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef(null);
  const [available, setAvailable] = useState();
  const [sold, setTotalSold] = useState();
  const [soldMoney, setTotalSoldMoney] = useState();
  const [leftMoney, setLeftMoney] = useState();
  const date = new Date(data.time_of_event).toLocaleDateString(
    "hr-HR",
    hrTimeFormat
  );

  function toggleDropdown(e) {
    setDropdown(!dropdown);

    // Disable arrow on 0.4 sec so user cannot spam
    disableArrow(true);
    setTimeout(() => {
      disableArrow(false);
    }, 400);

    if (!dropdown) e.target.style = "transform: rotate(-180deg)";
    else e.target.style = "transform: rotate(0deg)";
  }

  useEffect(() => {
    // Get the height of the dropdown content
    setDropdownHeight(dropdown ? dropdownRef.current.scrollHeight : 0);

    if (!dropdown) {
      setTimeout(() => {
        setBorderRadius(dropdown ? false : true);
      }, 200);
      return;
    }
    setBorderRadius(dropdown ? false : true);
  }, [dropdown]);

  // Get total loaned
  const calculateTotalLoaned = (categories) => {
    let totalLoaned = 0;
    let totalSold = 0;
    let soldMoney = 0;
    let totalVerifiedPrice = 0;

    for (const category in categories) {
      totalLoaned += categories[category].loaned;
      totalSold += categories[category].sold;
      soldMoney += categories[category].sold * categories[category].price;
    }
    if (data.reseller.transactions)
      for (const transaction of data.reseller.transactions) {
        if (transaction.is_verified) {
          totalVerifiedPrice += parseFloat(transaction.price);
        }
      }
    setLeftMoney(soldMoney - totalVerifiedPrice);
    return { loaned: totalLoaned, sold: totalSold, soldMoney: soldMoney };
  };

  useEffect(() => {
    const totalLoaned = calculateTotalLoaned(data.reseller.type);
    setAvailable(totalLoaned.loaned);
    setTotalSold(totalLoaned.sold);
    setTotalSoldMoney(totalLoaned.soldMoney);
  }, [data.reseller.type]);
  console.log(data.reseller);
  return (
    <div
      style={{
        borderBottomLeftRadius: hasBorderRadius ? "7px" : "0",
        borderBottomRightRadius: hasBorderRadius ? "7px" : "0",
        marginBottom: dropdown ? dropdownHeight + 10 : "10px",
      }}
      className="mytickets-card check-reseller-tickets"
    >
      <img
        style={{ borderBottomLeftRadius: hasBorderRadius ? "7px" : "0" }}
        src={`${process.env.REACT_APP_API_URL}/static/event-images/${data.poster.portrait}`}
        alt=""
      />
      <div className="mytickets-card-part">
        <div>
          <h5>{data.performer_name}</h5>
          <p>
            {date[0].toUpperCase() + date.slice(1)} - {data.place.place},{" "}
            {data.place.city}
          </p>
        </div>
        <div>
          <p>Dostupno: {available}</p>
          <p>Prodano: {sold}</p>
          <p>Ukupno: {soldMoney} BAM</p>
          <p>Preostalo: {leftMoney} BAM</p>
        </div>
      </div>

      <div
        style={{
          borderBottomRightRadius: hasBorderRadius ? "7px" : "0",
        }}
        className="dropdown-arrow-wrapper"
      >
        <img
          onClick={(e) => (!arrowDisabled ? toggleDropdown(e) : undefined)}
          src={ArrowIcon}
          alt="Drop"
          className="dropdown-arrow"
        />
      </div>
      <div
        style={{ maxHeight: dropdown ? dropdownHeight : 0 }}
        className="mytickets-card-dropdown"
        ref={dropdownRef}
      >
        <div className="profile-concert-wrapper">
          <div className="check-ticket-container">
            <div className="check-ticket-manager">
              {data.reseller.type &&
                Object.entries(data.reseller.type).map(
                  ([categoryName, categoryData]) => (
                    <TicketManager
                      key={categoryName}
                      type={categoryName}
                      price={categoryData.price}
                      totalAmount={categoryData.loaned}
                      totalSold={categoryData.sold}
                      setAvailable={setAvailable}
                      setTotalSold={setTotalSold}
                      setTotalSoldMoney={setTotalSoldMoney}
                      setLeftMoney={setLeftMoney}
                      concertId={concertId}
                      resellerId={reseller_id}
                    />
                  )
                )}
            </div>
          </div>
          {data.reseller.transactions &&
            data.reseller.transactions.map((transaction, index) => (
              <ApproveTicketSale
                setLeftMoney={setLeftMoney}
                key={index}
                transactions={transaction}
                i={index}
                concertId={concertId}
                resellerId={reseller_id}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
