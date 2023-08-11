import React from 'react';
import { Link } from 'react-router-dom';
import { hrTimeFormat } from '../../../../components/helper/timeFormat';

const MainSearchCard = ({ event }) => {
  const timeOfEvent = new Date(event.time_of_event);
  const date = timeOfEvent.toLocaleString('hr-HR', hrTimeFormat);
  const place = `${event.place.city}, ${event.place.place}`;

  return (
    <div className="search-card-container">
      <img
        src={`${process.env.REACT_APP_API_URL}/static/event-images/${event.poster.landscape}`}
        alt="Poster Image"
      />
      <div className="search-card-content-wrapper">
        <div className="card-info-wrapper">
          <h3>{event.performer_name}</h3>
          <p>
            {date} - {place}
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
