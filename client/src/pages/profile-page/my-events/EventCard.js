import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import { EventDayCard } from './EventDayCard';
import axios from 'axios';
import CategoryCard from './CategoyCard';
import { hrTimeFormatShort } from '../../../components/helper/timeFormatShort';

export const EventCard = ({ ids, i }) => {
  const [dropdown, setDropdown] = useState(false);
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [arrowDisabled, disableArrow] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [date, setDate] = useState(0);
  const [marginB, setMarginB] = useState(0);
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

      setLoading(false); // Set loading to false when data is fetched successfully
      const timeOfEvent = new Date(
        response.data[0].time_of_event
      ).toLocaleString('hr-HR', hrTimeFormatShort);
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

  // Go to Dodaj Preprodavaca
  function goToReseller(e) {
    e.preventDefault();

    document.querySelector('.add-reseller-link').click();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return (
    // Show loading indicator or data once it's available
    isLoading ? (
      <p>Učitavanje...</p>
    ) : data ? ( // Check if data is available before rendering
      <div
        style={{
          borderBottomLeftRadius: hasBorderRadius ? '7px' : '0',
          borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
          marginBottom: dropdown ? dropdownHeight + 10 + marginB : '10px',
        }}
        className="myevent-card-reseller"
      >
        <div className="myevent-card-part-1">
          <img
            style={{ borderBottomLeftRadius: hasBorderRadius ? '7px' : '0' }}
            src={
              `${process.env.REACT_APP_API_URL}/static/event-images/${data.poster.portrait}` ||
              ''
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
                Prodano: <strong>{data.tickets.free_sale.sold_amount}</strong>
              </span>
              <span>
                Ukupno:{' '}
                <strong>
                  {data.tickets.free_sale.amount_inBAM} <small>BAM</small>
                </strong>
              </span>
            </div>
            <div className="bottom-part-wrapper">
              <div className="bottom-part">
                {data.tickets.free_sale.type &&
                  Object.keys(data.tickets.free_sale.type).map(
                    (categoryKey) => (
                      <CategoryCard
                        key={categoryKey}
                        {...data.tickets.free_sale.type[categoryKey]}
                      />
                    )
                  )}
              </div>
            </div>
          </div>
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
          <img
            style={dropdown ? { rotate: '-180deg' } : { rotate: '0deg' }}
            src={ArrowIcon}
            alt="Drop"
          />
        </div>
        <div
          style={{ maxHeight: dropdown ? dropdownHeight + 100 + marginB : 0 }}
          className="myevents-card-dropdown"
          ref={dropdownRef}
        >
          <p className="heading">Preprodavači</p>
          <div className="profile-concert-wrapper">
            {data.tickets.free_sale.resellers[0] ? (
              data.tickets.free_sale.resellers.map((e, i) => {
                return (
                  <EventDayCard
                    key={i}
                    setMarginB={setMarginB}
                    iterator={i}
                    data={e}
                    concertId={data._id}
                  />
                );
              })
            ) : (
              <span className="warnning-message">
                Trenutno nemate preprodavača za ovaj događaj. Dodajte ih na
                sučelju{' '}
                <a
                  onClick={(e) => {
                    goToReseller(e);
                  }}
                  href="#"
                >
                  "Dodaj preprodavača"
                </a>
                .
              </span>
            )}
          </div>

          <p className="heading">Vremenski pregled prodaje</p>
          <div className="selling-timestamp">
            <p>Unesite datum pretrage:</p>
            <div className="time-input-wrapper">
              <p>Od:</p>
              <input className="test" type="date" />
              <p>Do:</p>
              <input type="date" />
              <a
                onClick={() => {
                  console.log(document.querySelector('.test').value);
                }}
                href="#"
              >
                Ispiši u PDF-u
              </a>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <p>Greška pri dohvatanju podataka. Pokušajte kasnije...</p>
    )
  );
};