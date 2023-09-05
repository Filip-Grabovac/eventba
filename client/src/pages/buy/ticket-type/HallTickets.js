import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const HallTickets = ({ concertData, activeCategory, handleClick }) => {
  const userId = useSelector((state) => state.userState.user);
  useEffect(() => {
    // Get the first category
    const firstCategory = Object.keys(concertData.tickets.online_sale.zones)[0];

    // Call the handleClick function with the first category as the parameter
    handleClick(firstCategory);
  }, [userId]);

  return (
    <div className="ticket-card">
      {concertData.tickets &&
        concertData.tickets.online_sale.zones &&
        Object.keys(concertData.tickets.online_sale.zones).map((category) => {
          const ticketType = concertData.tickets.online_sale.zones[category];
          const isSoldOut = ticketType.amount === 0;
          const isActiveCategory = activeCategory === category;

          const cardClass = isSoldOut
            ? "ticket-card-inner sold-out"
            : isActiveCategory
            ? "ticket-card-inner active"
            : "ticket-card-inner";

          const backgroundImageStyle = {
            backgroundImage: `url("${
              concertData.poster.landscape
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
                  <big>{category}</big>
                  <div>
                    Cijena: {ticketType.price}
                    <small> BAM</small>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default HallTickets;
