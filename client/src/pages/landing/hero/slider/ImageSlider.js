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

  const overlayCard = (e) => {
    const overlay = e.target.parentNode.querySelector(".slider-img-overlay");
    overlay.style = "opacity: 1";
  };
  const removeOverlayCard = (e) => {
    e.target.style = "opacity: 0";
  };

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
          <div
            onMouseOver={(e) => {
              overlayCard(e);
            }}
            onMouseLeave={removeOverlayCard}
            className="slider-img-overlay"
          ></div>
          <a
            onMouseOver={(e) => {
              overlayCard(e);
            }}
            className="slider-link"
            href="#"
          >
            Pogledaj
          </a>
        </div>
      ))}
    </Carousel>
  );
};

export default ImageSlider;