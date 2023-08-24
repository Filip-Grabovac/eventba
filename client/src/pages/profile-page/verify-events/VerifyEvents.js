import React, { useEffect, useState } from "react";
import { VerifyEventsCard } from "./VerifyEventsCard";
import axios from "axios";

export const VerifyEvents = () => {
  const [unverifiedEvents, setUnverifiedEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/unverified_events`
      );
      setUnverifiedEvents(response.data);
    } catch (error) {
      console.error("Error fetching unverified events:", error);
    }
  };
  const handleRefetch = async () => {
    await fetchEvents();
  };
  return (
    <>
      {unverifiedEvents.length > 0 ? (
        unverifiedEvents.map((event, i) => (
          <VerifyEventsCard
            event={event}
            handleRefetch={handleRefetch}
            key={i}
          />
        ))
      ) : (
        <h6 style={{ textAlign: "center" }}>
          Nema događaja koji čekaju na odobrenje
        </h6>
      )}
    </>
  );
};
