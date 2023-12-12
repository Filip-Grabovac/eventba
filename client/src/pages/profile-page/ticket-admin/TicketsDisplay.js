import React, { useEffect } from "react";
import { HistoryCard } from "./HistoryCard";
import axios from "axios";
import TicketGrid from "./TicketGrid";

import { useSelector } from "react-redux";

export const TicketsDisplay = ({ concertData, tickets, setTickets }) => {
  const token = useSelector((state) => state.userState.token);

  useEffect(() => {
    fetchTickets();
  }, [concertData._id]);

  const fetchTickets = async () => {
    if (concertData._id) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/tickets/tickets_for_${concertData._id}`
        );
        setTickets(response.data.tickets);
      } catch (error) {
        console.error(error);
      }
    }
  };
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
        {tickets && (
          <TicketGrid
            tickets={tickets}
            token={token}
            concertId={concertData._id}
          />
        )}
      </>
    )
  );
};
