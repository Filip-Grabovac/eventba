import React from "react";
import { ResellerConcertCard } from "./ResellerConcertCard";

export const PageRow = ({ heading, content, data }) => {
  const paragraphs = content.split("<br />");

  return (
    <div className="page-row">
      <div>
        <h6>{heading}</h6>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {data && data?.concerts !== [] && (
        <div className="event-div">
          {data.concerts.map((concertId, i) => (
            <ResellerConcertCard key={i} concertId={concertId} />
          ))}
        </div>
      )}
    </div>
  );
};
