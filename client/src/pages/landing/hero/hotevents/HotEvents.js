import React, { useEffect, useState } from 'react';
import FireIcon from '../../../../assets/ikonice/fire_icon.svg';
import HotEventsRow from './HotEventsRow';
import axios from 'axios';

export const HotEvents = () => {
  const [hotEvents, setHotEvents] = useState();
  // Fetch the data
  useEffect(() => {
    const fetchHotEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/get_hot_events`
        );
        setHotEvents(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchHotEvents();
  }, []);
  return (
    <div className="hot-events-wrapper">
      <h3>
        <img src={FireIcon} alt="Fire" />
        Top događaji
      </h3>
      {hotEvents
        ? hotEvents.map((e, i) => {
            return <HotEventsRow data={e} key={i} iterator={i} />;
          })
        : Array.from({ length: 3 }, (_, index) => (
            <div className="hotevents-skeleton" key={index}>
              <div></div>
              <div></div>
            </div>
          ))}
    </div>
  );
};
