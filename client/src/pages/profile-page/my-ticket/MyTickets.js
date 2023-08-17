import React from 'react';
import { ProfileEventCard } from './ProfileEventCard';

export const MyTickets = ({ buy_history }) => {
  return (
    <div className="mytickets-container">
      {buy_history[0] !== undefined ? (
        buy_history.map((e, i) => {
          return <ProfileEventCard key={i} data={e} i={i} />;
        })
      ) : (
        <p className="no-bought-tickets-msg">
          Nemate kupljenih ulaznica do sada
        </p>
      )}
    </div>
  );
};
