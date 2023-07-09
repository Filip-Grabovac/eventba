import React, { useEffect, useState } from "react";
import Hero from "./hero/Hero";
import { ThisWeek } from "../landing/thisWeek/ThisWeek";
import axios from "axios";

const SinglePage = () => {
  const [concertData, setConcertData] = useState(null);
  const id = new URLSearchParams(new URL(window.location.href).search).get(
    "id"
  );

  useEffect(() => {
    const fetchSinglePage = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${id}`
        );
        setConcertData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchSinglePage();
  }, []);

  return (
    <div className="single-page-container">
      {concertData ? (
        <div>
          <div className="single-page-top">
            <img
              src={require(`../../../../server/event-images/${concertData[0].poster.landscape}`)}
              alt=""
            />
            <div className="cover-overlay"></div>
          </div>
          <Hero id={id} concertData={concertData} />
          <ThisWeek heading="Iz iste sekcije" />
        </div>
      ) : (
        <div className="single-page-loader"></div>
      )}
    </div>
  );
};

export default SinglePage;
