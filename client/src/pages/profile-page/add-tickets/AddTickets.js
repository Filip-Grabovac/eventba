import axios from "axios";
import React, { useEffect, useState } from "react";
import { hrTimeFormat } from "../../../components/helper/timeFormat";
import { TicketGen } from "./TicketGen";
export const AddTickets = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [event, setEvent] = useState("");
  const [concertData, setConcertData] = useState(null);

  useEffect(() => {
    fetchConcertData();
  }, []);

  const fetchConcertData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts`
      );
      setAllEvents(response.data.concerts);
      console.log(response.data.concerts);
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
      <div className="choose-concert">
        <h5>Ispis ulaznica</h5>
        <select
          className="select-event"
          placeholder=""
          type="text"
          name="event"
          value={event}
          onChange={(e) => {
            e.target.style = "outline: none;";
            handleSelectChange(e);
          }}
        >
          <option value="" disabled hidden>
            Odaberi događaj
          </option>
          {allEvents[0] !== undefined ? (
            allEvents.map((e, i) => {
              // Convert the time_of_event string to a Date object
              const eventDate = new Date(e.time_of_event);
              return (
                <option
                  data-id={e._id}
                  value={`${e.performer_name} - ${eventDate.toLocaleDateString(
                    "hr-HR",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )} - ${e.place.place}`}
                  key={i}
                >
                  {`${e.performer_name} - ${eventDate.toLocaleDateString(
                    "hr-HR",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )} -  ${e.place.place}`}
                </option>
              );
            })
          ) : (
            <option disabled>Nemate organiziranih događaja</option>
          )}
        </select>
      </div>
      <div className="concert-container">
        {concertData && (
          <>
            <div className="top-part">
              <div className="info">
                <h4>{concertData.performer_name}</h4>
                <p style={{ textTransform: "capitalize" }}>
                  {new Date(concertData.time_of_event).toLocaleDateString(
                    "hr-HR",
                    hrTimeFormat
                  )}{" "}
                  - {concertData.place.place}, {concertData.place.city},
                  {concertData.place.country}
                </p>
              </div>
              <img
                className="info-buy-page-image"
                src={
                  concertData?.poster?.landscape
                    ? `${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.landscape}`
                    : ""
                }
                alt="concertData.poster.landscape"
              />
            </div>
            <TicketGen />
          </>
        )}
      </div>
    </>
  );
};
