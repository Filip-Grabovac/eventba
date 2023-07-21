import React, { useState } from "react";
import { Link } from "react-router-dom";

export const SliderCard = (props) => {
  const description = "";
  const [isMouseOver, setIsMouseOver] = useState(false);
  const performerName = props.data.performer_name;
  const place = props.data.place.city + ", " + props.data.place.place;
  const src = props.data.poster.landscape;
  const formattedDate = new Date(props.data.time_of_event)
    .toLocaleDateString("hr-HR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Zagreb",
    })
    .replace(/\//g, ".");

  return (
    <div
      onMouseOver={() => {
        setIsMouseOver(true);
      }}
      onMouseLeave={() => {
        setIsMouseOver(false);
      }}
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
        src={`${process.env.REACT_APP_API_URL}/static/event-images/${src}`}
        alt={description}
      />
      <p className="type">KONCERT</p>
      <p className="performer">{performerName}</p>
      <p className="date">{formattedDate}</p>
      <p className="location">{place}</p>
    </div>
  );
};
