import React from "react";

export const TicketBill = ({ i }) => {
  return (
    <div className="ticket-bill">
      <div className="ticket">Ulaznica {i + 1}:</div>
      <span>$ 30</span>
    </div>
  );
};
