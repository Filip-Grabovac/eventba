import React, { useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";
import { addTicket } from "../../store/ticketSlice";
import { Tooltip } from "react-tooltip";
import { addTicketPrice } from "../../store/ticketSlice";
import HallTickets from "./ticket-type/HallTickets";
import arrow from "../../assets/ikonice/arrow_icon.svg";

export const Personalization = React.memo(
  ({
    i,
    setShowPaymentForm,
    profileData,
    concertData,
    isChecked,
    setIsChecked,
  }) => {
    const [name, setName] = useState(profileData?.name || "");
    const [surname, setSurname] = useState(profileData?.lname || "");
    const [email, setEmail] = useState(profileData?.email || "");
    const [ticketPrice, setTicketPrice] = useState(0);
    const [activeCategory, setActiveCategory] = useState(null);

    const dispatch = useDispatch();
    const ticketID = i + 1;
    const memoizedName = useMemo(() => name, [name]);
    const memoizedSurname = useMemo(() => surname, [surname]);
    const memoizedEmail = useMemo(() => email, [email]);

    useEffect(() => {
      if (profileData && profileData.email !== email) {
        setName("");
        setSurname("");
        setEmail(profileData.email || "");
      }
    }, [profileData]);

    useEffect(() => {
      const ticket = {
        id: ticketID,
        name: name,
        lname: surname,
        email: email,
        price: 0,
      };

      setShowPaymentForm(false);
      dispatch(addTicket(ticket));
    }, [ticketID, name, surname, email, dispatch]);

    const handleClick = async (category) => {
      setActiveCategory(category);
      setShowPaymentForm(false);

      await setTicketPrice(
        concertData.tickets.online_sale.zones[category].price
      );
      await dispatch(
        addTicketPrice({
          ticketPrice: Number(
            concertData.tickets.online_sale.zones[category].price
          ),
          ticketID,
          category,
          name: concertData.tickets.online_sale.zones[category].name,
        })
      );
    };

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };
    const renderTooltipContentEmail = () => `Email za ulaznicu ${i + 1}`;
    const renderTooltipContentName = () => `Ime vlasnika ulaznice ${i + 1}`;

    return (
      <>
        <div className="personalization">
          {concertData?.place?.type === "hall" && (
            <HallTickets
              concertData={concertData}
              activeCategory={activeCategory}
              handleClick={handleClick}
              i={i}
            />
          )}
          <div className="person-check-flex">
            <h4>Personalizacija</h4>

            <img
              src={arrow}
              id={`checkbox-${i}`}
              className={isChecked ? "clicked arrow" : "arrow"}
              onClick={handleCheckboxChange}
              alt="arrow"
            />
          </div>
          {isChecked ? (
            <div className="profile-form">
              <form
                className="form container"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="row">
                  <div className="item1 col">
                    <input
                      disabled={!isChecked}
                      placeholder="Ime"
                      type="text"
                      id={`name-${i}`}
                      value={!isChecked ? "" : memoizedName}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <Tooltip
                    style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
                    anchorId={`name-${i}`}
                    place="top"
                    variant="info"
                    content={renderTooltipContentName}
                  />
                  <div className="item2 col">
                    <input
                      disabled={!isChecked}
                      placeholder="Prezime"
                      type="text"
                      id="surname"
                      value={!isChecked ? "" : memoizedSurname}
                      onChange={(e) => setSurname(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="item3 col">
                    <input
                      placeholder="Email"
                      type="email"
                      id={`email-${i}`}
                      value={memoizedEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Tooltip
                      style={{
                        borderRadius: "10px",
                        backgroundColor: "#455cd9",
                      }}
                      anchorId={`email-${i}`}
                      place="top"
                      variant="info"
                      content={renderTooltipContentEmail}
                    />
                  </div>
                </div>
              </form>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
);
