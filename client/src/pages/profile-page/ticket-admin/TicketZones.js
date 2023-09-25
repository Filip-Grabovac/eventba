import React from "react";

export const TicketZones = ({ tickets }) => {
  return (
    <div className="zones-wrapper">
      <div className="zones">
        {tickets &&
          tickets.map((zone) => (
            <div className="zone-card">
              <div className="zone-name">
                {zone.categoryName} - {zone.ticketType}
              </div>
              <div className="zone-num">Broj: {zone.ticketsNum}</div>
              <div className="zone-price">
                Cijena: {zone.ticketPrice} <small>BAM</small>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
