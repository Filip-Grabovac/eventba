import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import { TicketManager } from './TicketManager';
import { ApproveTicketSale } from './ApproveTicketSale';

export const CheckTicketsCard = () => {
  const [dropdown, setDropdown] = useState(false);
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [arrowDisabled, disableArrow] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef(null);
  const [available, setAvailable] = useState(40);
  const [sold, setTotalSold] = useState(0);
  const [soldMoney, setTotalSoldMoney] = useState(0);
  const [leftMoney, setLeftMoney] = useState(0);

  function toggleDropdown(e) {
    setDropdown(!dropdown);

    // Disable arrow on 0.4 sec so user cannot spam
    disableArrow(true);
    setTimeout(() => {
      disableArrow(false);
    }, 400);

    if (!dropdown) e.target.style = 'transform: rotate(-180deg)';
    else e.target.style = 'transform: rotate(0deg)';
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

  return (
    <div
      style={{
        borderBottomLeftRadius: hasBorderRadius ? '7px' : '0',
        borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
        marginBottom: dropdown ? dropdownHeight + 10 : '10px',
      }}
      className="mytickets-card check-reseller-tickets"
    >
      <img
        style={{ borderBottomLeftRadius: hasBorderRadius ? '7px' : '0' }}
        src={`${process.env.REACT_APP_API_URL}/static/event-images/aca_lukas_portrait.jpg`}
        alt=""
      />
      <div className="mytickets-card-part">
        <div>
          <h5>Aca Lukas</h5>
          <p>07.jun.2023 22:00 - Bitefartcafe, Beograd</p>
        </div>
        <div>
          <p>Dostupno: {available}</p>
          <p>Prodano: {sold}</p>
          <p>Ukupno: {soldMoney} BAM</p>
          <p>Preostalo: {leftMoney} BAM</p>
        </div>
      </div>

      <div className="dropdown-arrow-wrapper">
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
          <div className="check-ticket-manager">
            <TicketManager
              type="Parter"
              price={15}
              totalAmount={10}
              totalSold={0}
              setAvailable={setAvailable}
              setTotalSold={setTotalSold}
              setTotalSoldMoney={setTotalSoldMoney}
              setLeftMoney={setLeftMoney}
            />
            <TicketManager
              type="Tribine"
              price={15}
              totalAmount={20}
              totalSold={0}
              setAvailable={setAvailable}
              setTotalSold={setTotalSold}
              setTotalSoldMoney={setTotalSoldMoney}
              setLeftMoney={setLeftMoney}
            />
            <TicketManager
              type="VIP"
              price={20}
              totalAmount={10}
              totalSold={0}
              setAvailable={setAvailable}
              setTotalSold={setTotalSold}
              setTotalSoldMoney={setTotalSoldMoney}
              setLeftMoney={setLeftMoney}
            />
          </div>
          <ApproveTicketSale setLeftMoney={setLeftMoney} />
          <ApproveTicketSale setLeftMoney={setLeftMoney} />
        </div>
      </div>
    </div>
  );
};
