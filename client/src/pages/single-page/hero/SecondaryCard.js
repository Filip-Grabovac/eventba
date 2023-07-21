import React from "react";
import { Link } from "react-router-dom";
import { hrTimeFormat } from "../../../components/helper/timeFormat";
export const SecondaryCard = (props) => {
  const portraitImg = props.concertData[0].poster.portrait;
  const performerName = props.concertData[0].performer_name;
  const timeOfEvent = new Date(props.concertData[0].time_of_event);
  const date = timeOfEvent.toLocaleString("hr-HR", hrTimeFormat);
  const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);
  const place = `${props.concertData[0].place.city}, ${props.concertData[0].place.place}`;

  return (
    <div className="secondary-card-single">
      <img
        src={`${process.env.REACT_APP_API_URL}/static/event-images/${portraitImg}`}
        alt="Poster img"
      />
      <div>
        <h3>{performerName}</h3>
        <p>{place}</p>
      </div>
      <div className="right">
        <p className="single-date">{formattedDate}</p>
        <Link to={`/buy?id=${props.id}`}>Kupi</Link>
      </div>
    </div>
  );
};
