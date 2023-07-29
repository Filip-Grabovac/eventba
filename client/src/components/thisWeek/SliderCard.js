import React, { useState } from "react";
import { Link } from "react-router-dom";
import { hrTimeFormat } from "../helper/timeFormat";
import { useTranslation } from "react-i18next";

export const SliderCard = ({ data }) => {
  const description = "";
  const [isMouseOver, setIsMouseOver] = useState(false);
  const performerName = data.performer_name;
  const place = data.place.city + ", " + data.place.place;
  const src = data.poster.landscape;
  const date = new Date(data.time_of_event).toLocaleDateString(
    "hr-HR",
    hrTimeFormat
  );
  const { t } = useTranslation();

  const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);
  return (
    <div
      onMouseOver={() => {
        setIsMouseOver(true);
      }}
      onMouseLeave={() => {
        setIsMouseOver(false);
      }}
      className="slider-card"
      style={{ scrollSnapAlign: "center" }}
    >
      <div
        className={`this-week-overlay ${isMouseOver ? "visible" : ""}`}
      ></div>
      {isMouseOver && (
        <Link
          className="slider-link-this-week"
          onClick={() => {
            window.location.href = `/single?id=${data._id}`;
          }}
        >
          Pogledaj
        </Link>
      )}
      <img
        src={`${process.env.REACT_APP_API_URL}/static/event-images/${src}`}
        alt={description}
      />
      <p className="type" style={{ textTransform: "uppercase" }}>
        {t(`type.${data.type[0]}`)}
      </p>
      <p className="performer">{performerName}</p>
      <p className="date">{formattedDate}</p>
      <p className="location">{place}</p>
    </div>
  );
};
