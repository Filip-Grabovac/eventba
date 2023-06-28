import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const SliderCard = (props) => {
  const navigate = useNavigate();
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

  const overlayCard = (e) => {
    const overlay = e.target.parentNode.querySelector(".this-week-overlay");
    const btn = e.target.parentNode.querySelector(".slider-link-this-week");
    overlay.style = "opacity: 1";
    btn.style = "opacity: 1";
  };
  const removeOverlayCard = (e) => {
    const btn = e.target.parentNode.querySelector(".slider-link-this-week");
    e.target.style = "opacity: 0";
    btn.style = "opacity: 0";
  };

  return (
    <div
      onMouseOver={(e) => {
        overlayCard(e);
      }}
      onMouseLeave={removeOverlayCard}
      className="slider-card"
    >
      <div
        onMouseOver={(e) => {
          overlayCard(e);
        }}
        className="this-week-overlay"
      ></div>
      <Link
        onMouseOver={(e) => {
          overlayCard(e);
        }}
        className="slider-link-this-week"
        onClick={() => {
          window.location.href = `/single?id=${props.data._id}`;
        }}
      >
        Pogledaj
      </Link>
      <img
        src={require(`../../../assets/event_images/${src}`)}
        alt={description}
      />
      <p className="type">KONCERT</p>
      <p className="performer">{performerName}</p>
      <p className="date">{formattedDate}</p>
      <p className="location">{place}</p>
    </div>
  );
};
