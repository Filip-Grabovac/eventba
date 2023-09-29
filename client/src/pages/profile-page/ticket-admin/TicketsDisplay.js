import React from "react";
import { HistoryCard } from "./HistoryCard";
import TicketSearch from "./TicketSearch";

export const TicketsDisplay = ({ concertData, tickets, setTickets }) => {
  return (
    concertData && (
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
            className="img-admin"
            src={`${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.landscape}`}
            alt="Portrait"
          />
        </div>
        {concertData && concertData.print_history.length > 0 && (
          <>
            <h6>Povijest printanja</h6>
            <div className="print-history-wrapper">
              {concertData &&
                concertData.print_history &&
                concertData.print_history.map((print, i) => (
                  <HistoryCard key={i} data={print} />
                ))}
            </div>
          </>
        )}
        <h6>Pregled svih ulaznica</h6>
        <div className="all-tickets-display">
          {concertData && (
            <TicketSearch
              concertId={concertData._id}
              tickets={tickets}
              setTickets={setTickets}
            />
          )}
        </div>
      </>
    )
  );
};
