import React, { useState } from "react";
import { EventSearch } from "../ticket-admin/EventSearch";
import axios from "axios";
import { UpdateEventContainer } from "./UpdateEventContainer";

export const UpdateEvent = ({ allEvents }) => {
  const [concertData, setConcertData] = useState(null);

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

      setFilteredEvents([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error fetching concert data:", error);
    }
  };

  return (
    <div className="update-event">
      <h6>Odaberi događaj</h6>
      <EventSearch
        allEvents={allEvents}
        handleSelectChange={handleSelectChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredEvents={filteredEvents}
        setFilteredEvents={setFilteredEvents}
      />
      {concertData && (
        <>
          <div className="top">
            <div className="info">
              <div className="performer">{concertData.performer_name}</div>
              <div className="city">
                {concertData.place.city}, {concertData.place.place},{" "}
                {concertData.place.country}
              </div>
              <div className="date">
                {new Date(concertData.time_of_event).toLocaleString("hr-HR", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  timeZone: "Europe/Zagreb",
                })}
              </div>
            </div>
            <img
              className="img-admin "
              src={`${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.landscape}`}
              alt="Portrait"
            />
          </div>
          <UpdateEventContainer concertData={concertData} />
        </>
      )}
    </div>
  );
};
