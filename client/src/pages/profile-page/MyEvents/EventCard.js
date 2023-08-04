import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import { EventDayCard } from './EventDayCard';
import axios from 'axios';
import CategoryCard from './CategoyCard';

export const EventCard = ({ ids, i }) => {
  const [dropdown, setDropdown] = useState(false);
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [arrowDisabled, disableArrow] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchConcertData();
  }, []);
  const fetchConcertData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${ids._id}`
      );
      setData(response.data[0]);
      console.log(response.data[0]);
      setLoading(false); // Set loading to false when data is fetched successfully
      const timeOfEvent = new Date(
        response.data[0].time_of_event
      ).toLocaleString('hr-HR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Europe/Zagreb',
      });
      const date = timeOfEvent.charAt(0).toUpperCase() + timeOfEvent.slice(1);
      setDate(date);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

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
    // Show loading indicator or data once it's available
    isLoading ? (
      <p>Loading...</p>
    ) : data ? ( // Check if data is available before rendering
      <div
        style={{
          borderBottomLeftRadius: hasBorderRadius ? '7px' : '0',
          borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
          marginBottom: dropdown ? dropdownHeight + 10 : '10px',
        }}
        className="myevent-card"
      >
        <div className="myevent-card-part-1">
          <img
            style={{ borderBottomLeftRadius: hasBorderRadius ? '7px' : '0' }}
            src={
              `${
                process.env.REACT_APP_API_URL
              }/static/event-images/${'1690145527916_686_portrait.jpg'}` || ''
            }
            alt="Portrait image"
          />

          <div className="conc-info">
            <h6>{data.performer_name}</h6>
            <p>{date}</p>
            <p>
              {data.place.place}, {data.place.city}, {data.place.country}
            </p>
          </div>
        </div>
        <div className="sales-wrapper">
          <div className="myevent-card-part-2">
            <p className="heading">Online prodaja</p>
            <div className="top-part">
              <span>
                Prodano: <strong>{data.tickets.online_sale.sold_amount}</strong>
              </span>
              <span>
                Ukupno:{' '}
                <strong>
                  {data.tickets.online_sale.amount_inBAM} <small>BAM</small>
                </strong>
              </span>
            </div>
            <div className="bottom-part-wrapper">
              <div className="bottom-part">
                {Object.keys(data.tickets.online_sale.type).map(
                  (categoryKey) => (
                    <CategoryCard
                      key={categoryKey}
                      {...data.tickets.online_sale.type[categoryKey]}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <div className="myevent-card-part-2">
            <p className="heading">Slobodna prodaja</p>
            <div className="top-part">
              <span>
                Prodano: <strong>{data.tickets.online_sale.sold_amount}</strong>
              </span>
              <span>
                Ukupno:{' '}
                <strong>
                  {data.tickets.online_sale.amount_inBAM} <small>BAM</small>
                </strong>
              </span>
            </div>
            <div className="bottom-part-wrapper">
              <div className="bottom-part">
                {Object.keys(data.tickets.online_sale.type).map(
                  (categoryKey) => (
                    <CategoryCard
                      key={categoryKey}
                      {...data.tickets.online_sale.type[categoryKey]}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="myevent-card-part-3"
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
          style={{ maxHeight: dropdown ? dropdownHeight + 100 : 0 }}
          className="myevents-card-dropdown"
          ref={dropdownRef}
        >
          <p className="heading">Preprodavači</p>
          <div className="profile-concert-wrapper">
            <EventDayCard />
            <EventDayCard />
          </div>
          <p className="heading">Vremenski pregled prodaje</p>
          <div className="selling-timestamp">
            <p>Unesite datum pretrage:</p>
            <div className="time-input-wrapper">
              <p>Od:</p>
              <input type="text" />
              <p>Do:</p>
              <input type="text" />
              <a href="#">Ispiši u PDF-u</a>
            </div>
          </div>
          <div className="selling-overview-wrapper">
            <div className="selling-overview-date">
              <p className="date">07.kol.2023</p>
            </div>
            <div>
              <p className="heading">Online prodaja</p>
              <div>
                <div>
                  <p>Parter</p>
                  <p>Prodano: 30/100</p>
                  <p>Cijena: 300 BAM</p>
                </div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    ) : (
      <p>Error fetching data.</p>
    )
  );
};
