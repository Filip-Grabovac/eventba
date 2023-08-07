import React from "react";
import { hrTimeFormat } from "../../../components/helper/timeFormat";
import { TicketGen } from "./TicketGen";

export const EventDetails = ({ concertData, displayTicketGen }) => {
  return (
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
          {displayTicketGen ? <TicketGen concertData={concertData} /> : ""}
        </>
      )}
    </div>
  );
};
