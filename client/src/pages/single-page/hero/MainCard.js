import React from 'react';
import { hrTimeFormat } from '../../../components/helper/timeFormat';

const MainCard = (props) => {
  const performerName = props.concertData[0].performer_name;
  const timeOfEvent = new Date(props.concertData[0].time_of_event);
  const date = timeOfEvent.toLocaleString('hr-HR', hrTimeFormat);
  const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);
  const place = `${props.concertData[0].place.city}, ${props.concertData[0].place.place}`;
  const description = props.concertData[0].description;
  const landscapeImg = props.concertData[0].poster.landscape;

  return (
    <div className="container-fluid single-main-card">
      <div className="row sinkle-page-row">
        <div className="col-lg-6">
          <h3>{performerName}</h3>
          <p className="card-main-info">
            {formattedDate} - {place}
          </p>
          <div className="line"></div>
          <p className="card-other-info">{description}</p>
        </div>
        <div className="col-lg-6 single-page-wrapper">
          <img
            className="single-page-cover"
            src={`${process.env.REACT_APP_API_URL}/static/event-images/${landscapeImg}`}
            alt="Cover Image"
          />
        </div>
      </div>
    </div>
  );
};

export default MainCard;
