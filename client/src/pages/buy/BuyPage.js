import React, { useEffect, useRef, useState } from "react";
import minus from "../../assets/ikonice/minus.svg";
import plus from "../../assets/ikonice/plus.svg";
import Carousel from "react-elastic-carousel";
import { Personalization } from "./Personalization";
import visa from "../../assets/ikonice/money.svg";
import { TicketBill } from "./TicketBill";
import { removeLastTicket, resetState } from "../../store/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import PaymentForm from "./PaymentForm";
import axios from "axios";

export const BuyPage = () => {
  const [concertData, setConcertData] = useState({});
  const [ticketAmount, setTicketAmount] = useState(1);
  const carouselRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const dispatch = useDispatch();
  const addTicket = () => {
    setTicketAmount(ticketAmount + 1);
  };
  const totalAmount = useSelector((state) => state.ticketState.totalAmount);

  useEffect(() => {
    dispatch(resetState());
  }, []);

  const removeTicket = () => {
    if (ticketAmount === 1) return;
    setTicketAmount(ticketAmount - 1);
    dispatch(removeLastTicket({ id: ticketAmount }));
  };

  const handleSliderCardClick = (index) => {
    setActiveCardIndex(index);
    carouselRef.current.goTo(index);
  };

  const renderSliderCards = () => {
    const sliderCards = [];
    for (let i = 0; i < ticketAmount; i++) {
      sliderCards.push(
        <button
          className={`slider-cards ${
            activeCardIndex === i ? "active-card" : ""
          } `}
          key={i}
          onClick={() => handleSliderCardClick(i)}
        >
          Ulaznica {i + 1}
        </button>
      );
    }
    return sliderCards;
  };

  //TAKE ID and fetch data

  const id = new URLSearchParams(new URL(window.location.href).search).get(
    "id"
  );
  useEffect(() => {
    const fetchBuyPage = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${id}`
        );
        setConcertData(response.data[0]);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchBuyPage();
  }, []);

  const timeOfEvent = new Date(concertData.time_of_event).toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="single-page-container">
      <div className="single-page-top">
        <img
          src={
            concertData?.poster?.landscape
              ? require(`../../assets/event_images/${concertData.poster.landscape}`)
              : ""
          }
          alt="concertData.poster.landscape"
        />

        <div className="cover-overlay"></div>
      </div>
      <div className="buy-container">
        <div className="left">
          <div className="info">
            <h3>{concertData.performer_name}</h3>
            <p className="card-main-info">
              {timeOfEvent} - {concertData?.place?.city},{" "}
              {concertData?.place?.place}
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
              onChange={(currentItem) => setActiveCardIndex(currentItem.index)}
            >
              {[...Array(ticketAmount)].map((_, i) => (
                <Personalization key={i} i={i} />
              ))}
            </Carousel>
          </div>
        </div>
        <div className="right">
          <img
            src={
              concertData?.poster?.landscape
                ? require(`../../assets/event_images/${concertData.poster.landscape}`)
                : ""
            }
            alt="concertData.poster.landscape"
          />

          <div className="payment-bill">
            {[...Array(ticketAmount)].map((_, i) => (
              <TicketBill key={i} i={i} />
            ))}
          </div>
          <div className="saldo">
            <p>Ukupna cijena</p>
            <span>{totalAmount} €</span>
          </div>
          <div className="payment-method">
            {/* <p>Način plaćanja</p> */}
            <PaymentForm />
            <div className="icons-bar">
              {/* <img src={visa} alt="" />
              <img src={visa} alt="" />
              <img src={visa} alt="" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
