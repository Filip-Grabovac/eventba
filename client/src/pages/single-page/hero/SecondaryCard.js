import React from "react";
import { Link } from "react-router-dom";
export const SecondaryCard = (props) => {
  const portraitImg = props.concertData[0].poster.portrait;
  const performerName = props.concertData[0].performer_name;
  const timeOfEvent = new Date(props.concertData[0].time_of_event);
  const formattedDate = timeOfEvent.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const place = `${props.concertData[0].place.city}, ${props.concertData[0].place.place}`;

  return (
    <div className="secondary-card-single">
      <img
        src={require(`../../../assets/event_images/${portraitImg}`)}
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
