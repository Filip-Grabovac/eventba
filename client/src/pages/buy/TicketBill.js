import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const TicketBill = ({ i }) => {
  const ticketID = i + 1;
  const ticket = useSelector((state) =>
    state.ticketState.ticketList.find((ticket) => ticket.id === ticketID)
  );
  return (
    <div className="ticket-bill">
      <div className="ticket">Ulaznica {ticketID}:</div>
      <span>{ticket ? ticket.price : 0} BAM</span>
    </div>
  );
};
