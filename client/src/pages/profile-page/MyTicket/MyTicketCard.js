import React from "react";

export const MyTicketCard = ({ data }) => {
  return (
    <div className="ticket-card">
      <div>
        <div className="ticket-parts">
          <span>Vlasnik:</span>
          <h6>{data.owner}</h6>
        </div>
        <div className="ticket-parts">
          <span>Email:</span>
          <p>{data.email}</p>
        </div>
      </div>
      <div>
        <div className="ticket-parts">
          <span>Tip:</span>
          <p>{data.ticketType}</p>
        </div>
        <div className="ticket-parts">
          <span>Pozicija:</span>
          <p>{data.position}</p>
        </div>
      </div>
      <div>
        <div className="ticket-parts">
          <span>Cijena:</span>
        </div>
        <div className="ticket-parts">
          <p>{data.price} BAM</p>
        </div>
      </div>
    </div>
  );
};
