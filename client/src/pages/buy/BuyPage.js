import React, { useRef, useState } from "react";
import SinglePageCover from "../../assets/images/test.png";
import minus from "../../assets/ikonice/minus.svg";
import plus from "../../assets/ikonice/plus.svg";
import Carousel from "react-elastic-carousel";
import { Personalization } from "./Personalization";

export const BuyPage = () => {
  const [ticketAmount, setTicketAmount] = useState(1);
  const carouselRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const addTicket = () => {
    setTicketAmount(ticketAmount + 1);
  };

  const removeTicket = () => {
    if (ticketAmount === 1) return;
    setTicketAmount(ticketAmount - 1);
  };

  const handleSliderCardClick = (index) => {
    carouselRef.current.goTo(index);
    setActiveCardIndex(index);
  };

  const renderSliderCards = () => {
    const sliderCards = [];
    for (let i = 0; i < ticketAmount; i++) {
      sliderCards.push(
        <button
          className={`slider-cards `}
          style={
            activeCardIndex === i
              ? { color: "#455cd9", backgroundColor: "#fff" }
              : {}
          }
          key={i}
          onClick={() => handleSliderCardClick(i)}
        >
          Ulaznica {i + 1}
        </button>
      );
    }
    return sliderCards;
  };

  return (
    <div className="single-page-container">
      <div className="single-page-top">
        <img src={SinglePageCover} alt="" />
        <div className="cover-overlay"></div>
      </div>
      <div className="buy-container">
        <div className="left">
          <div className="info">
            <h3>Matija Cvek</h3>
            <p className="card-main-info">
              07.jun.2023 22:00 - Bitefartcafe, Beograd
            </p>
          </div>

          <div className="specification">
            <div className="amount">
              <h4>Količina</h4>
              <div className="left">
                <button onClick={removeTicket}>
                  <img src={minus} alt="minus" />
                </button>
                <span>{ticketAmount}</span>
                <button onClick={addTicket}>
                  <img src={plus} alt="plus" />
                </button>
              </div>
            </div>
            <div className="slider-bar">
              <div className="sliders">{renderSliderCards()}</div>
            </div>
            <Carousel
              itemsToShow={1}
              enableAutoPlay={false}
              disableArrowsOnEnd={false}
              ref={carouselRef}
            >
              {[...Array(ticketAmount)].map((_, i) => (
                <Personalization key={i} i={i} isChecked={true} />
              ))}
            </Carousel>
          </div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  );
};
