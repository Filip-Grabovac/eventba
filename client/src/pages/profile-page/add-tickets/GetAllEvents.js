import React from "react";

export const GetAllEvents = ({ allEvents, event, handleSelectChange }) => {
  return (
    <select
      className="select-event"
      placeholder=""
      type="text"
      name="event"
      value={event}
      onChange={(e) => {
        e.target.style = "outline: none;";
        handleSelectChange(e);
      }}
    >
      <option value="" disabled hidden>
        Odaberi događaj
      </option>
      {allEvents[0] !== undefined ? (
        allEvents.map((e, i) => {
          // Convert the time_of_event string to a Date object
          const eventDate = new Date(e.time_of_event);
          return (
            <option
              data-id={e._id}
              value={`${e.performer_name} - ${eventDate.toLocaleDateString(
                "hr-HR",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }
              )} - ${e.place.place}`}
              key={i}
            >
              {`${e.performer_name} - ${eventDate.toLocaleDateString("hr-HR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })} -  ${e.place.place} - ${e.place.city}`}
            </option>
          );
        })
      ) : (
        <option disabled>Nemate organiziranih događaja</option>
      )}
    </select>
  );
};
