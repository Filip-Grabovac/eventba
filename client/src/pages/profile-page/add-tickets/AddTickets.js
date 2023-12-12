import axios from "axios";
import React, { useEffect, useState } from "react";
import { GetAllEvents } from "./GetAllEvents";
import { EventDetails, EventDetailsTicket } from "./EventDetailsTicket";

export const AddTickets = ({ adminEmail, adminName }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [event, setEvent] = useState("");
  const [concertData, setConcertData] = useState(null);

  useEffect(() => {
    fetchConcertData();
  }, [concertData]);

  const fetchConcertData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts`
      );
      setAllEvents(response.data.concerts);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSelectChange = async (e) => {
    const selectedOption = e.target.value;
    setEvent(selectedOption);

    // Extracting the data-id from the selected option
    const dataId =
      e.target.options[e.target.selectedIndex].getAttribute("data-id");

    // Fetching concert data using the extracted dataId
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${dataId}`
      );
      setConcertData(response.data[0]);
    } catch (error) {
      console.error("Error fetching concert data:", error);
    }
  };

  return (
    <>
      <div className={`choose-concert`}>
        <h6>Administracija ulaznica</h6>
        <GetAllEvents
          allEvents={allEvents}
          event={event}
          handleSelectChange={handleSelectChange}
        />
      </div>
      {concertData && (
        <EventDetailsTicket
          adminEmail={adminEmail}
          concertData={concertData}
          setConcertData={setConcertData}
          adminName={adminName}
          displayTicketGen={true}
        />
      )}
    </>
  );
};
