import React from "react";
import FireIcon from "../../../../assets/ikonice/fire_icon.svg";
import HotEventsRow from "./HotEventsRow";

export const HotEvents = () => {
  return (
    <div className="hot-events-wrapper">
      <h3>
        <img src={FireIcon} alt="Fire" />
        Hot Events
      </h3>
      <HotEventsRow />
      <HotEventsRow />
      <HotEventsRow />
      <HotEventsRow />
      <HotEventsRow />
      <HotEventsRow />
    </div>
  );
};
