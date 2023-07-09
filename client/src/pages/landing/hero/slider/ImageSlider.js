import React, { useEffect, useState } from "react";
import Carousel from "react-elastic-carousel";
import axios from "axios";
import { ImageCard } from "./ImageCard";
import { HotEvents } from "../hotevents/HotEvents";

const ImageSlider = () => {
  const [hotEventsData, setHotEvents] = useState([]);

  const breakpoints = [
    { width: 300, itemsToShow: 1 },
    { width: 350, itemsToShow: 2 },
    { width: 500, itemsToShow: 2.5 },
    { width: 700, itemsToShow: 4 },
    { width: 1000, itemsToShow: 5 },
    { width: 1200, itemsToShow: 5 },
    { width: 1400, itemsToShow: 7 },
  ];

  useEffect(() => {
    const fetchHotConcerts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/is_promoted_event/true`
        );
        setHotEvents(response.data);
        console.log(hotEventsData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchHotConcerts();
  }, []);
  return (
    <Carousel
      breakPoints={breakpoints}
      itemsToShow={7}
      enableAutoPlay={true}
      autoPlaySpeed={3000}
      pagination={false}
    >
      {hotEventsData[0] === undefined
        ? Array.from({ length: 7 }, (_, index) => (
            <div className="skeleton" key={index}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ))
        : hotEventsData.map((item, i) => <ImageCard key={i} data={item} />)}
    </Carousel>
  );
};

export default ImageSlider;
