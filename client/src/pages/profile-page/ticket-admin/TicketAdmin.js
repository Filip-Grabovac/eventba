import React, { useState } from "react";

import axios from "axios";
import { GetAllEvents } from "../add-tickets/GetAllEvents";
import { TicketsDisplay } from "./TicketsDisplay";

export const TicketAdmin = ({ allEvents }) => {
  const [event, setEvent] = useState("");
  const [concertData, setConcertData] = useState(null);
  const [tickets, setTickets] = useState([]);
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
      setTickets([]);
    } catch (error) {
      console.error("Error fetching concert data:", error);
    }
  };
  return (
    <>
      <div className={`choose-concert`}>
        <h6>Pregledaj sve ulaznice</h6>
        <GetAllEvents
          allEvents={allEvents}
          event={event}
          handleSelectChange={handleSelectChange}
        />
      </div>
      <div className="all-ticket-display">
        <TicketsDisplay
          concertData={concertData}
          tickets={tickets}
          setTickets={setTickets}
        />
      </div>
    </>
  );
};
