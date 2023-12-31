import React from "react";
import { hrTimeFormat } from "../../components/helper/timeFormat";

export const ListPageCard = ({ data }) => {
  if (!data) return;
  const date = new Date(data.time_of_event).toLocaleDateString(
    "hr-HR",
    hrTimeFormat
  );
  return (
    <div className="list-page-card">
      <div className="list-page-overlay"></div>
      <img
        className="list-page-landscape"
        src={`${process.env.REACT_APP_API_URL}/static/event-images/${data.poster.landscape}`}
        alt="Landscape"
        loading="lazy"
      />
      <div className="list-page-type-wrapper">
        <div className="first-child">
          <div className="media-helper">
            <h5>{data.performer_name}</h5>
            <p className="list-page-date">
              {date} - {data.place.place}, {data.place.city}
            </p>
          </div>
          <div className="list-page-line"></div>

          <div
            className="list-page-desc"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
        <div className="media-helper-2nd">
          <div className="second-child">
            <img
              className="list-page-landscape2"
              src={`${process.env.REACT_APP_API_URL}/static/event-images/${data.poster.landscape}`}
              alt="Portrait"
              loading="lazy"
            />
          </div>
          <div className="third-child">
            <div className="list-page-btns-wrapper">
              <a href={`/buy?id=${data._id}`}>Kupi</a>
              <div className="list-page-btns-line"></div>
              <a href={`/single?id=${data._id}`}>Pogledaj</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
