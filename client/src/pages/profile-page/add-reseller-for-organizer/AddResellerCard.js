import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';

import TicketCategories from './TicketCategories';
export const AddResellerCard = ({
  userData,
  freeSaleData,
  concertId,
  setConcertData,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef(null);
  const [arrowDisabled, disableArrow] = useState(false);

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
  }, [dropdown, freeSaleData]);

  // Toggle dropdown
  function toggleDropdown() {
    setDropdown(!dropdown);

    // Disable arrow on 0.4 sec so user cannot spam
    disableArrow(true);
    setTimeout(() => {
      disableArrow(false);
    }, 400);
  }
  return (
    <div
      style={{
        borderBottomLeftRadius: hasBorderRadius ? '7px' : '0',
        borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
        marginBottom: dropdown ? dropdownHeight + 10 : '10px',
      }}
      className="myevent-card reseller-card"
    >
      <div className="myevent-card-part-2">
        <p>{userData.reseller_info.sellingPlaceName}</p>
        <p>{userData.reseller_info.sellingPlaceAddress}</p>
      </div>
      <div className="line"></div>
      <div className="myevent-card-part-2">
        <p>{userData.fullName}</p>
        <p>{userData.reseller_info.sellingPlaceNumber}</p>
      </div>
      <div
        onClick={(e) => (!arrowDisabled ? toggleDropdown(e) : undefined)}
        className="myevent-card-part-3"
        style={{
          borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
          backgroundColor: hasBorderRadius
            ? 'rgba(69, 91, 217, 0.7)'
            : 'rgba(69, 91, 217, 0.5)',
        }}
      >
        <p>Dodjeli ulaznice</p>
        <img
          style={dropdown ? { rotate: '-180deg' } : { rotate: '0deg' }}
          className="dropdown-arrow"
          src={ArrowIcon}
          alt="Drop"
        />
      </div>
      <TicketCategories
        setConcertData={setConcertData}
        userData={userData}
        concertId={concertId}
        freeSaleData={freeSaleData}
        dropdown={dropdown}
        dropdownHeight={dropdownHeight}
        dropdownRef={dropdownRef}
      />
    </div>
  );
};
