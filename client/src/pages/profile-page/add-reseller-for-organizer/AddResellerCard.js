import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import UserManagerIcon from '../../../assets/ikonice/user_manager_icon.svg';
export const AddResellerCard = ({ data }) => {
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
  }, [dropdown]);

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
      className="myevent-card"
    >
      <div className="myevent-card-part-2">
        <p>{data.reseller_info.sellingPlaceName}</p>
        <p>{data.reseller_info.sellingPlaceAddress}</p>
      </div>
      <div className="line"></div>
      <div className="myevent-card-part-2">
        <p>{data.fullName}</p>
        <p>{data.reseller_info.sellingPlaceNumber}</p>
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
      <div
        style={{ maxHeight: dropdown ? dropdownHeight + 20 : 0 }}
        className="myevents-card-dropdown resellers-list-dropdown"
        ref={dropdownRef}
      >
        <div className="add-reseller-dropdown-part">
          <div>
            <p>Kategorija 1 - Parter </p>
          </div>
          <div>
            <p>Broj ulaznica</p>
            <input type="text" placeholder="Dostupno: 380" />
          </div>
        </div>
        <div className="add-reseller-dropdown-part">
          <div>
            <p>Kategorija 1 - Parter </p>
          </div>
          <div>
            <p>Broj ulaznica</p>
            <input type="text" placeholder="Dostupno: 380" />
          </div>
        </div>
        <a className="add-reseller" href="#">
          Dodaj
        </a>
      </div>
    </div>
  );
};
