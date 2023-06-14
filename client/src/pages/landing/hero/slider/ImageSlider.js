import React from "react";
import Carousel from "react-elastic-carousel";
import ForthImg from "../../../../assets/event_images/forth_event_img.svg";
import ThirdImg from "../../../../assets/event_images/third_event_img.svg";
import SecondImg from "../../../../assets/event_images/second_event_img.svg";

const ImageSlider = () => {
  const items = [
    { src: ThirdImg },
    { src: ForthImg },
    { src: SecondImg },
    { src: ThirdImg },
    { src: ForthImg },
    { src: SecondImg },
    { src: ForthImg },
    { src: SecondImg },
    { src: SecondImg },
    { src: ForthImg },
    { src: ThirdImg },
    { src: ForthImg },
    { src: SecondImg },
  ];
  return (
    <Carousel
      itemsToShow={7}
      enableAutoPlay={true}
      autoPlaySpeed={3000}
      pagination={false}
    >
      {items.map((item, i) => (
        <div key={i} className="slider-image-container">
          <img className="slider-img" key={i} src={item.src} />
          <div className="slider-img-overlay"></div>
          <a className="slider-link" href="#">
            Pogledaj
          </a>
        </div>
      ))}
    </Carousel>
  );
};

export default ImageSlider;
