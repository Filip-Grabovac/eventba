import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import CheckIcon from '../../../assets/ikonice/check2_icon.svg';
import TrashCan from '../../../assets/ikonice/trash_can.svg';

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

  // Approve event
  function verifyEvent() {}

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
            <div className="verify-event-portrait-wrapper">
              <img
                src={`${process.env.REACT_APP_API_URL}/static/event-images/1691680588365_958_portrait.jpg`}
                alt=""
                className="verify-event-wrapper-img"
              />
            </div>
            <div className="sponsors-wrapper">
              <h6>Sponzori</h6>

              <ul>
                <li>Avatar</li>
                <li>Avatar</li>
                <li>Avatar</li>
                <li>Avatar</li>
                <li>Avatar</li>
                <li>Avatar</li>
                <li>Avatar</li>
                <li>Avatar</li>
              </ul>
            </div>
            <div className="line"></div>
            <div className="additional-event-info">
              <div>
                <h6>Lorem</h6>
                <p>Lorem Ipsum</p>
              </div>
              <div>
                <h6>Lorem</h6>
                <p>Lorem Ipsum</p>
              </div>
            </div>
            <div className="line"></div>
            <div className="description-wrapper">
              <h6>Opis</h6>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt
                omnis, rerum, iste excepturi debitis soluta totam inventore,
                impedit minima error perspiciatis assumenda? Magnam minima eius
                quos deserunt similique consequuntur corrupti nihil debitis?
                Laudantium repellendus facere voluptate tenetur velit distinctio
                vitae.
              </p>
            </div>
            <div className="line"></div>
            <div className="event-verifier-btns-wrapper">
              <div onClick={verifyEvent}>
                <img src={CheckIcon} alt="Check" />
              </div>
              <div>
                <img src={TrashCan} alt="Delete" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
