import React, { useEffect, useState } from 'react';
import { GetAllEvents } from '../add-tickets/GetAllEvents';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { EventDetails } from '../add-tickets/EventDetails';
import { ProfileTopPart } from '../userManager/ProfileTopPart';
import { AddResellerCard } from './AddResellerCard';

export const AddReseller = ({ resellers }) => {
  const userId = useSelector((state) => state.userState.user);
  const [allEvents, setAllEvents] = useState([]);
  const [event, setEvent] = useState('');
  const [concertData, setConcertData] = useState(null);
  const [filteredResellers, setFilteredResellers] = useState(resellers);

  useEffect(() => {
    fetchConcertData();
  }, []);

  // Fetch separate concert data
  const fetchConcertData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/organizer/${userId}`
      );
      setAllEvents(response.data);
    } catch (error) {
      console.error('Error fetching entrance checker:', error);
    }
  };

  const handleSelectChange = async (e) => {
    const selectedOption = e.target.value;
    setEvent(selectedOption);

    // Extracting the data-id from the selected option
    const dataId =
      e.target.options[e.target.selectedIndex].getAttribute('data-id');

    // Fetching concert data using the extracted dataId
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${dataId}`
      );
      setConcertData(response.data[0]);
    } catch (error) {
      console.error('Error fetching concert data:', error);
    }
  };

  // Search resellers
  function searchData(e) {
    const searchValue = e.target.value.toLowerCase();
    setFilteredResellers(
      resellers.filter(
        (reseller) =>
          reseller.fullName.toLowerCase().includes(searchValue) ||
          reseller.email.toLowerCase().includes(searchValue)
      )
    );
  }

  return (
    <div className="add-reseller-event">
      <div className="choose-concert">
        <h5>Dodjeljivanje preprodavača</h5>
        <GetAllEvents
          allEvents={allEvents}
          event={event}
          handleSelectChange={handleSelectChange}
        />
      </div>
      <EventDetails concertData={concertData} displayTicketGen={false} />
      <div className="add-reseller-event-bottom">
        <div className="bottom-part">
          {concertData ? (
            <>
              <ProfileTopPart
                fetchData={(e) => {
                  searchData(e);
                }}
                hasSearch={true}
                content="Lista preprodavača"
                searchContent="Pretražite"
              />
              {filteredResellers &&
                filteredResellers.map((e, i) => {
                  return <AddResellerCard data={e} key={i} />;
                })}
            </>
          ) : (
            ''
          )}
        </div>
        {concertData ? (
          <div className="bottom-part">
            <h6>Ulaznice za slobodnu prodaju</h6>
            <p>Ukupno: {concertData.tickets.free_sale.total_amount}</p>
            <p>Zaduženo: {concertData.tickets.free_sale.total_loaned}</p>
            <p>
              Dostupno:{' '}
              {concertData.tickets.free_sale.total_amount -
                concertData.tickets.free_sale.total_loaned}
            </p>
            <div className="line"></div>
            <div className="category">
              <p>Kategorija 1 - Parter</p>
              <p>Dostupno/zaduženo: 20/400</p>
            </div>
            <div className="category">
              <p>Kategorija 1 - Parter</p>
              <p>Dostupno/zaduženo: 20/400</p>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
