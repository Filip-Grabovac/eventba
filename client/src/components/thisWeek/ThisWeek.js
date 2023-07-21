import React, { useEffect, useState } from "react";
import Carousel from "react-elastic-carousel";
import { SliderCard } from "./SliderCard";
import axios from "axios";

export const ThisWeek = (props) => {
  const [thisWeek, setThisWeekData] = useState(null);

  // Slider setup
  const breakpoints = [
    { width: 200, itemsToShow: 1 },
    { width: 400, itemsToShow: 2 },
    { width: 1000, itemsToShow: 2 },
    { width: 1500, itemsToShow: 3 },
  ];

  // Fetch the data
  useEffect(() => {
    const fetchThisWeekData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/this_week/true`
        );
        setThisWeekData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchThisWeekData();
  }, []);

  return (
    <div className="this-week">
      <h3>{props.heading}</h3>
      <div className="slider">
        <Carousel
          itemsToShow={3}
          enableAutoPlay={true}
          autoPlaySpeed={5000}
          pagination={false}
          breakPoints={breakpoints}
        >
          {!thisWeek || !Array.isArray(thisWeek)
            ? Array.from({ length: 3 }, (_, index) => (
                <div className="skeleton" key={index}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ))
            : thisWeek.map((item, i) => <SliderCard key={i} data={item} />)}
        </Carousel>
      </div>
    </div>
  );
};
