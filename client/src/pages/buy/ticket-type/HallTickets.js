import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

const HallTickets = React.memo(
  ({ concertData, activeCategory, handleClick, i }) => {
    const userId = useSelector((state) => state.userState.user);
    const lastTicketCategory = useSelector(
      (state) => state.ticketState.ticketList[i - 1]?.category
    );

    useEffect(() => {
      const firstCategory = Object.keys(
        concertData.tickets.online_sale.zones
      )[0];

      if (i > 0) handleClick(lastTicketCategory);
      else handleClick(firstCategory);
    }, [userId]);

    const backgroundImageStyle = useMemo(() => {
      return {
        backgroundImage: `url("${
          concertData.poster.landscape
            ? `${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.portrait}`
            : ""
        }")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }, [concertData.poster]);

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
  }
);

export default HallTickets;
