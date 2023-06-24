import React, { useState } from "react";
import SinglePageCover from "../../assets/images/test.png";
import minus from "../../assets/ikonice/minus.svg";
import plus from "../../assets/ikonice/plus.svg";

import { Personalization } from "./Personalization";

export const BuyPage = () => {
  const [ticketAmount, setTicketAmount] = useState(1);

  const addTicket = () => {
    setTicketAmount(ticketAmount + 1);
  };
  const removeTicket = () => {
    if (ticketAmount === 1) return;
    setTicketAmount(ticketAmount - 1);
  };

  const renderSliderCards = () => {
    const sliderCards = [];
    for (let i = 1; i <= ticketAmount; i++) {
      sliderCards.push(
        <div className={`slider-cards`} key={i}>
          Ulaznica {i}
        </div>
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
            <div className="personalization">
              <div className="person-check-flex">
                <h4>Personalizacija</h4>
                <input type="checkbox" />
              </div>
              <Personalization />
            </div>
          </div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  );
};
