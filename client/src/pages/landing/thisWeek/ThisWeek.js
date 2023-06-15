import React from "react";
import Carousel from "react-elastic-carousel";
import { SliderCard } from "./SliderCard";

export const ThisWeek = (props) => {
  return (
    <div className="this-week">
      <h3>{props.heading}</h3>
      <div className="slider">
        <Carousel
          itemsToShow={3}
          enableAutoPlay={true}
          autoPlaySpeed={5000}
          pagination={false}
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
