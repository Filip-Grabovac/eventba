import React, { useEffect, useState } from "react";
import Carousel from "react-elastic-carousel";
import ForthImg from "../../../../assets/event_images/forth_event_img.svg";
import ThirdImg from "../../../../assets/event_images/third_event_img.svg";
import SecondImg from "../../../../assets/event_images/aca_lukas_portrait.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { ImageCard } from "./ImageCard";

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
      {hotEventsData &&
        hotEventsData.map((item, i) => <ImageCard key={i} data={item} />)}
    </Carousel>
  );
};

export default ImageSlider;
