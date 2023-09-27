import React, { useState } from "react";
import { EventCard } from "./EventCard";
import sortByTime from "../../../functions/sortByTimeOfEvent";

export const MyEvent = ({ organizerEvents }) => {
  const currentTime = new Date();

  // Initialize state to keep track of the current view
  const [currentView, setCurrentView] = useState("upcoming");

  // Filter events into upcoming and past events
  const upcomingEvents = organizerEvents.filter((event) => {
    const eventTime = new Date(event.time_of_event);
    return eventTime > currentTime;
  });

  const pastEvents = organizerEvents.filter((event) => {
    const eventTime = new Date(event.time_of_event);
    return eventTime <= currentTime;
  });

  // Function to handle button click and toggle the view
  const toggleView = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="mytickets-container">
      <div className="button-wrapper-my-events">
        <button
          className={`btn ${currentView === "upcoming" ? "active" : ""}`}
          onClick={() => toggleView("upcoming")}
        >
          Nadolazeći događaji
        </button>
        <button
          className={`btn ${currentView === "past" ? "active" : ""}`}
          onClick={() => toggleView("past")}
        >
          Završeni događaji
        </button>
      </div>
      {currentView === "upcoming" ? (
        <>
          <h6>Nadolazeći događaji</h6>
          {sortByTime(upcomingEvents).map((e, i) => (
            <EventCard key={i} ids={e} i={i} />
          ))}
        </>
      ) : (
        <>
          <h6>Prošli događaji</h6>
          {sortByTime(pastEvents).map((e, i) => (
            <EventCard key={i} ids={e} i={i} />
          ))}
        </>
      )}
    </div>
  );
};
