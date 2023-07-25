import React, { useEffect } from "react";

const HallTickets = ({ concertData, activeCategory, handleClick }) => {
  useEffect(() => {
    // Get the first category
    const firstCategory = Object.keys(concertData.tickets.type)[0];

    // Call the handleClick function with the first category as the parameter
    handleClick(firstCategory);
  }, []);

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

          const backgroundImageStyle = {
            backgroundImage: `url("${
              concertData?.poster?.landscape
                ? `${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.portrait}`
                : ""
            }")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          };

          return (
            <div
              className={cardClass}
              onClick={() => handleClick(category)}
              key={category}
              style={backgroundImageStyle}
            >
              <div
                className={`glassy-overlay ${
                  isActiveCategory ? "activeGloss" : ""
                }`}
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
            </div>
          );
        })}
    </div>
  );
};

export default HallTickets;
