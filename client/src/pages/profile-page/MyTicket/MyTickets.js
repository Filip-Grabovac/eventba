import React from "react";
import { ProfileEventCard } from "./ProfileEventCard";

export const MyTickets = ({ buyHistory }) => {
  return (
    <div className="mytickets-container">
      {buyHistory[0] !== undefined ? (
        buyHistory.map((e, i) => {
          return <ProfileEventCard key={i} data={e} />;
        })
      ) : (
        <p className="no-bought-tickets-msg">
          Nemate kupljenih ulaznica do sada
        </p>
      )}
    </div>
  );
};
