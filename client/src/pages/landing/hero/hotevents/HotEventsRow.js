import React from "react";
import { hrTimeFormat } from "../../../../components/helper/timeFormat";
import { useNavigate } from "react-router-dom";

const HotEventsRow = ({ data, iterator }) => {
  const date = new Date(data.time_of_event).toLocaleString(
    "hr-HR",
    hrTimeFormat
  );
  const navigate = useNavigate();

  function redirectToEvent() {
    navigate(`/single?id=${data._id}`);
  }

  return (
    <div onClick={redirectToEvent} className="hot-events-row">
      <div className="hot-events-row-overlay"></div>
      <div className="event-num">#{iterator + 1}</div>
      <img
        src={`${process.env.REACT_APP_API_URL}/static/event-images/${data.poster.landscape}`}
        alt="Event"
      />
      <h4>{data.performer_name}</h4>
      <div className="event-datetime">
        <p>{date}</p>
        <p>
          {data.place.place}, {data.place.city}
        </p>
      </div>
    </div>
  );
};

export default HotEventsRow;
