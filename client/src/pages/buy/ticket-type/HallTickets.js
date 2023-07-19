import React from "react";

const HallTickets = ({ concertData, activeCategory, handleClick }) => {
  return (
    <div className="ticket-card">
      {concertData.tickets &&
        concertData.tickets.type &&
        Object.keys(concertData.tickets.type).map((category) => {
          const ticketType = concertData.tickets.type[category];
          const isSoldOut = ticketType.amount === 0;
          const isActiveCategory = activeCategory === category;

          const cardClass = isSoldOut
            ? "ticket-card-inner sold-out"
            : isActiveCategory
            ? "ticket-card-inner active"
            : "ticket-card-inner";

          return (
            <div
              className={cardClass}
              onClick={() => handleClick(category)}
              key={category}
            >
              <div className={`ticket-card-name ${ticketType.name}`}>
                {ticketType.name}
              </div>
              <div className="ticket-card-content">
                <div>
                  Cijena: {ticketType.price}
                  <small> BAM</small>
                </div>
                <div>Preostalo: {ticketType.amount}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default HallTickets;
