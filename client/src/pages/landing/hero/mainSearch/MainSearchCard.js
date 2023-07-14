import React from "react";
import { Link } from "react-router-dom";

const MainSearchCard = ({ event }) => {
  const timeOfEvent = new Date(event.time_of_event);
  const formattedDate = timeOfEvent.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const place = `${event.place.city}, ${event.place.place}`;

  return (
    <div className="search-card-container">
      <img
        src={require(`../../../../../../server/ticket-gen/public/event-images/${event.poster.landscape}`)}
        alt="Poster Image"
      />
      <div className="search-card-content-wrapper">
        <div className="card-info-wrapper">
          <h3>{event.performer_name}</h3>
          <p>
            {formattedDate} - {place}
          </p>
        </div>
        <div className="card-btns-wrapper">
          <Link to={`/single?id=${event._id}`}>Pogledaj</Link>
          <Link to={`/buy?id=${event._id}`}>Kupi</Link>
        </div>
      </div>
    </div>
  );
};

export default MainSearchCard;
