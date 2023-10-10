import React from "react";

export const EventSearch = ({
  allEvents,
  handleSelectChange,
  searchTerm,
  setSearchTerm,
  filteredEvents,
  setFilteredEvents,
}) => {
  // Function to filter events based on performer_name
  const handleSearch = (query) => {
    setSearchTerm(query);

    // Filter events whose performer_name contains the query
    const filtered = allEvents.filter((event) =>
      event.performer_name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredEvents(filtered);
  };

  return (
    <div className="event-search">
      <input
        style={{ width: "300px" }}
        type="text"
        placeholder="Unesite ime izvođača"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul>
        {filteredEvents.map((event, i) => (
          <li
            id={event._id}
            key={i}
            onClick={() => handleSelectChange(event._id)}
          >
            {event.performer_name}, {event.place.city}
          </li>
        ))}
      </ul>
    </div>
  );
};
