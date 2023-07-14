import React, { useState } from "react";
import { Link } from "react-router-dom";

export const SliderCard = (props) => {
  const description = "";
  const performerName = props.data.performer_name;
  const formattedDate = new Date(props.data.time_of_event)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".");
  const place = props.data.place.city + ", " + props.data.place.place;
  const src = props.data.poster.landscape;

  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className="slider-card"
    >
      <div
        className={`this-week-overlay ${isMouseOver ? "visible" : ""}`}
      ></div>
      {isMouseOver && (
        <Link
          className="slider-link-this-week"
          onClick={() => {
            window.location.href = `/single?id=${props.data._id}`;
          }}
        >
          Pogledaj
        </Link>
      )}
      <img
        src={require(`../../../../../server/ticket-gen/public/event-images/${src}`)}
        alt={description}
      />
      <p className="type">KONCERT</p>
      <p className="performer">{performerName}</p>
      <p className="date">{formattedDate}</p>
      <p className="location">{place}</p>
    </div>
  );
};
