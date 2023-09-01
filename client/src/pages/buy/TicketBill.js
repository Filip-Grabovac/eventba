import React from "react";
import { useSelector } from "react-redux";

export const TicketBill = ({ i }) => {
  const ticketID = i + 1;
  const ticket = useSelector((state) =>
    state.ticketState.ticketList.find((ticket) => ticket.id === ticketID)
  );

  return (
    <div className="ticket-bill">
      <div className="ticket">
        Ulaznica {ticketID} - {ticket?.ticketName} <br /> {ticket?.category} :
      </div>
      <span>
        {ticket ? ticket.price : 0} <small> BAM</small>
      </span>
    </div>
  );
};
