import React from "react";
import Carousel from "react-elastic-carousel";
import { SliderCard } from "./SliderCard";

export const ThisWeek = (props) => {
  const breakpoints = [
    { width: 1000, itemsToShow: 1 },
    { width: 1000, itemsToShow: 2 },
    { width: 1500, itemsToShow: 3 },
  ];

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
          <SliderCard />
          <SliderCard />
          <SliderCard />
          <SliderCard />
          <SliderCard />
        </Carousel>
      </div>
    </div>
  );
};
