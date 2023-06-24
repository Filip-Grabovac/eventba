import React from "react";
import { Link } from "react-router-dom";

export const ImageCard = (props) => {
  const src = props.data.poster.portrait;
  const id = props.data._id;

  const overlayCard = (e) => {
    const overlay = e.target.parentNode.querySelector(".slider-img-overlay");
    const btn = e.target.parentNode.querySelector(".slider-link");
    overlay.style = "opacity: 1";
    btn.style = "opacity: 1";
  };
  const removeOverlayCard = (e) => {
    const btn = e.target.parentNode.querySelector(".slider-link");
    e.target.style = "opacity: 0";
    btn.style = "opacity: 0";
  };

  return (
    <div className="slider-image-container">
      <img
        className="slider-img"
        src={require(`../../../../assets/event_images/${src}`)}
      />
      <div
        onMouseOver={(e) => {
          overlayCard(e);
        }}
        onMouseLeave={removeOverlayCard}
        className="slider-img-overlay"
      ></div>
      <Link
        onMouseOver={(e) => {
          overlayCard(e);
        }}
        className="slider-link"
        to={`/single?id=${id}`}
      >
        Pogledaj
      </Link>
    </div>
  );
};
