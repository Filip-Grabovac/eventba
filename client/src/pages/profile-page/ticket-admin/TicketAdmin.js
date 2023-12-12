import React, { useState } from "react";

import axios from "axios";

import { TicketsDisplay } from "./TicketsDisplay";
import { EventSearch } from "./EventSearch";

export const TicketAdmin = ({ allEvents }) => {
  const [concertData, setConcertData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const handleSelectChange = async (id) => {
    // Extracting the data-id from the selected option

    // Fetching concert data using the extracted dataId
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${id}`
      );
      setConcertData(response.data[0]);
      setTickets([]);
      setFilteredEvents([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error fetching concert data:", error);
    }
  };
  return (
    <div className="admin-ticket-container">
      <div className={`choose-concert`}>
        <h6>Odaberi događaj</h6>
        <EventSearch
          allEvents={allEvents}
          handleSelectChange={handleSelectChange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          setFilteredEvents={setFilteredEvents}
        />
      </div>
      <div className="all-ticket-display" style={{ padding: "20px" }}>
        {!concertData ? null : (
          <TicketsDisplay
            concertData={concertData}
            tickets={tickets}
            setTickets={setTickets}
          />
        )}
      </div>
    </div>
  );
};
