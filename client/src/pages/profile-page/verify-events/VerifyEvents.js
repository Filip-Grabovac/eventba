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

  return (
    <>
      {unverifiedEvents.map((event) => (
        <VerifyEventsCard event={event} key={event.id} />
      ))}
    </>
  );
};
