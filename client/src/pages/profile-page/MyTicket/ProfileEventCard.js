import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import { MyTicketCard } from './MyTicketCard';
import { hrTimeFormat } from '../../../components/helper/timeFormat';

export const ProfileEventCard = ({ data, i }) => {
  const [dropdown, setDropdown] = useState(false);
  const [formattedDate, setFormattedDate] = useState();
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [arrowDisabled, disableArrow] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    if (data) {
      const date = new Date(data.event.time).toLocaleString(
        'hr-HR',
        hrTimeFormat
      );
      const timeOfEvent = date.charAt(0).toUpperCase() + date.slice(1);
      setFormattedDate(timeOfEvent);
    }
  }, [data]);

  if (!data) return;

  const buyTime = new Date(data.event.date).toLocaleString('hr-HR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Zagreb',
  });

  return (
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
        src={`${process.env.REACT_APP_API_URL}/static/event-images/${
          data.event.poster && data.event.poster.portrait
        }`}
        alt=""
      />
      <div className="mytickets-card-part">
        <div>
          <h5>{data.event.performer}</h5>
          <p>{formattedDate}</p>
          <p>
            {data.event.location.place}, {data.event.location.city}
          </p>
        </div>
      </div>
      <div className="mytickets-card-part">
        <div>
          <h5>Kupovina: {i + 1}</h5>
          <p>{buyTime}</p>
          <p>Ukupna cijena: {data.event.pricesSum} BAM</p>
        </div>
      </div>
      <div
        className="mytickets-card-part"
        style={{
          borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
          backgroundColor: hasBorderRadius
            ? 'rgba(69, 91, 217, 0.7)'
            : 'rgba(69, 91, 217, 0.5)',
        }}
      >
        <img
          onClick={(e) => (!arrowDisabled ? toggleDropdown(e) : undefined)}
          src={ArrowIcon}
          alt="Drop"
        />
      </div>
      <div
        style={{ maxHeight: dropdown ? dropdownHeight : 0 }}
        className="mytickets-card-dropdown"
        ref={dropdownRef}
      >
        <div className="profile-concert-wrapper">
          {data &&
            data.event.tickets.map((e, i) => {
              return <MyTicketCard key={i} data={e} />;
            })}
        </div>
      </div>
    </div>
  );
};
