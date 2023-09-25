import React from "react";
import { HistoryCard } from "./HistoryCard";
import TicketSearch from "./TicketSearch";

export const TicketsDisplay = ({ concertData, tickets, setTickets }) => {
  return (
    <>
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
  );
};
