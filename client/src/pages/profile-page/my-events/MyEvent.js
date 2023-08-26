import React from "react";
import { EventCard } from "./EventCard";

export const MyEvent = ({ organizerEvents }) => {
  return (
    <div className="mytickets-container">
      {organizerEvents[0] !== undefined ? (
        organizerEvents.map((e, i) => {
          return <EventCard key={i} ids={e} i={i} />;
        })
      ) : (
        <p className="no-bought-tickets-msg">Nemate organiziranih događaja</p>
      )}
    </div>
  );
};
