import React from "react";
import { useSelector } from "react-redux";

export const TicketBill = ({ i }) => {
  const ticketID = i + 1;
  const ticket = useSelector((state) =>
    state.ticketState.ticketList.find((ticket) => ticket.id === ticketID)
  );

  return (
    <div className="ticket-bill">
      <div>
        <big>
          {" "}
          Ulaznica {ticketID} - {ticket?.ticketName}
        </big>{" "}
        <br /> {ticket?.category && `Zona: ${ticket.category}`}
        {ticket?.row &&
          ticket?.seat &&
          ` - Red: ${ticket.row} - Sjedalo: ${ticket.seat}`}
      </div>
      <span>
        {ticket ? ticket.price : 0} <small> BAM</small>
      </span>
    </div>
  );
};
