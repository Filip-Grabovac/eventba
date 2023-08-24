import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';

export const VerifyEventsCard = () => {
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [dropdown, setDropdown] = useState(false);
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

  function toggleDropdown(e) {
    setDropdown(!dropdown);

    // Disable arrow on 0.4 sec so user cannot spam
    disableArrow(true);
    setTimeout(() => {
      disableArrow(false);
    }, 400);
  }

  return (
    <div>
      <div
        style={{
          borderBottomLeftRadius: hasBorderRadius ? '7px' : '0',
          borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
          marginBottom: dropdown ? dropdownHeight + 10 : '10px',
        }}
        className="mytickets-card"
      >
        <img
          style={{ borderBottomLeftRadius: hasBorderRadius ? '7px' : '0' }}
          src={`${process.env.REACT_APP_API_URL}/static/event-images/1691680588365_908_landscape.jpg`}
          alt=""
        />
        <div className="mytickets-card-part">
          <div>
            <h5>Matija Cvek</h5>
          </div>
        </div>
        <div className="mytickets-card-part">
          <div>
            <p>07.jun.2023 22:00 Bitefartcafe, Beograd</p>
          </div>
        </div>
        <div
          className="mytickets-card-part"
          onClick={(e) => (!arrowDisabled ? toggleDropdown(e) : undefined)}
          style={{
            borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
            backgroundColor: hasBorderRadius
              ? 'rgba(69, 91, 217, 0.7)'
              : 'rgba(69, 91, 217, 0.5)',
          }}
        >
          <img
            style={dropdown ? { rotate: '-180deg' } : { rotate: '0deg' }}
            src={ArrowIcon}
            alt="Drop"
          />
        </div>
        <div
          style={{ maxHeight: dropdown ? dropdownHeight : 0 }}
          className="mytickets-card-dropdown"
          ref={dropdownRef}
        >
          <div className="verify-event-wrapper">
            <img
              src={`${process.env.REACT_APP_API_URL}/static/event-images/1691680588365_908_landscape.jpg`}
              alt=""
              className="verify-event-wrapper-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
