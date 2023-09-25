import React from "react";
import { TicketZones } from "./TicketZones";

export const HistoryCard = ({ data }) => {
  return (
    <div className="print">
      <div className="gen-info">
        {data.user},{" "}
        {new Date(data.date).toLocaleString("hr-HR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: "Europe/Zagreb",
        })}
        , generirao:
      </div>
      <TicketZones tickets={data.tickets} />
    </div>
  );
};
