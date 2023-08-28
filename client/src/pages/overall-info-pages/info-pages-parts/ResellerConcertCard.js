import axios from "axios";
import React, { useEffect, useState } from "react";
import MainSearchCard from "../../landing/hero/main-search/MainSearchCard";

export const ResellerConcertCard = ({ concertId }) => {
  const [concertData, setConcertData] = useState([]);

  useEffect(() => {
    fetchResellers();
  }, []);

  const fetchResellers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${concertId}`
      );
      console.log(response.data);
      setConcertData(response.data[0]);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <div className="event-div">
      {concertData && <MainSearchCard event={concertData} />}
    </div>
  );
};
