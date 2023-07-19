import React, { useEffect, useRef, useState } from "react";
import minus from "../../assets/ikonice/minus.svg";
import plus from "../../assets/ikonice/plus.svg";
import Carousel from "react-elastic-carousel";
import { Personalization } from "./Personalization";
import { TicketBill } from "./TicketBill";
import { removeLastTicket } from "../../store/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import PaymentForm from "./PaymentForm";
import axios from "axios";
import { toast } from "react-toastify";
import { toastSetup } from "../../functions/toastSetup";

export const BuyPage = () => {
  const [concertData, setConcertData] = useState({});
  const [ticketAmount, setTicketAmount] = useState(1);
  const carouselRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [toolTipOpen, setToolTipOpen] = useState(false);

  const activeCardRef = useRef(null);
  const allTickets = useSelector((state) => state.ticketState.ticketList);
  const ticketsWithoutEmails = allTickets.filter(
    (ticket) => ticket.email === ""
  );
  const ticketsIdWithoutEmail = ticketsWithoutEmails.map((ticket) => ticket.id);

  const dispatch = useDispatch();
  const totalAmount = useSelector((state) => state.ticketState.totalAmount);
  const ticketGenData = useSelector((state) => state.ticketState);

  // Setting order number 1. time u get on buy page
  useEffect(() => {
    setOrderNumber(Math.floor(Math.random() * 100000000000000) + 1);
  }, []);

  const addTicket = async () => {
    await setTicketAmount(ticketAmount + 1);
    setShowPaymentForm(false);
    setActiveCardIndex(ticketAmount + 1);
    carouselRef.current.goTo(ticketAmount + 1);
  };

  const removeTicket = () => {
    if (ticketAmount === 1) return;
    setTicketAmount(ticketAmount - 1);
    dispatch(removeLastTicket({ id: ticketAmount }));
  };

  const handleSliderCardClick = (index) => {
    setActiveCardIndex(index);
    carouselRef.current.goTo(index);
  };
  useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [activeCardIndex]);

  const renderSliderCards = () => {
    const sliderCards = [];
    for (let i = 0; i < ticketAmount; i++) {
      sliderCards.push(
        <button
          className={`slider-cards ${
            activeCardIndex === i ? "active-card" : ""
          }`}
          ref={activeCardIndex === i ? activeCardRef : null}
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

  const fetchBuyPage = async () => {
    try {
      const id = new URLSearchParams(new URL(window.location.href).search).get(
        "id"
      );
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${id}`
      );
      setConcertData(response.data[0]);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  useEffect(() => {
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

  // Fetching data for payment

  const userId = useSelector((state) => state.userState.user);
  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/id/${userId}`
      );
      setProfileData(response.data);
      if (!response.data.isVerified) {
        toast.error(
          `Verificirajte vaš račun na: "${response.data.email}" da biste mogli obaviti kupovinu!`,
          toastSetup("top-right", 3000)
        );
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // BUY BUTTON
  // Chek if mails are there, to enable pay button
  const handleButtonClick = () => {
    fetchBuyPage();
    fetchProfileData();
    console.log(profileData);
    const ticketsWithoutEmails = allTickets.filter(
      (ticket) => ticket.email === ""
    );
    const ticketsIdWithoutEmail = ticketsWithoutEmails.map(
      (ticket) => ticket.id
    );
    const ticketsWithoutSeat = allTickets.filter(
      (ticket) => ticket.price === 0
    );
    const ticketsIdWithoutSeat = ticketsWithoutSeat.map((ticket) => ticket.id);
    {
      if (ticketsIdWithoutEmail.length === 0 && profileData.isVerified) {
        if (ticketsIdWithoutSeat.length === 0) {
          setShowPaymentForm(true);

          const allEmails = allTickets.map((ticket) => ticket.email);

          const uniqueEmails = allEmails.filter((email, index) => {
            return allEmails.indexOf(email) === index;
          });
          const timeOfToast = uniqueEmails * 2000;
          if (uniqueEmails.length === 1) {
            toast.success(
              `Vaše ulaznice će biti poslane na mail ${uniqueEmails}. Odaberite način plaćanja.`,
              toastSetup("top-right", 3000)
            );
          } else {
            toast.success(
              `Vaše ulaznice će biti poslane na iduće emailove:\n${uniqueEmails.join(
                "\n"
              )}. Odaberite način plaćanja.`,

              {
                position: "top-right",
                autoClose: timeOfToast,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              }
            );
          }

          async function sendPostRequest() {
            try {
              console.log({
                ticketGenData: ticketGenData,
                concertData: concertData,
                orderNumber,
              });
              // Send the POST request using Axios and wait for the response
              await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/payment/get_ticket_data`,
                {
                  ticketGenData: ticketGenData,
                  concertData: concertData,
                  orderNumber,
                }
              );
            } catch (error) {
              // Handle any errors that occurred during the request
              toast.error(
                `Problem sa slanjem podataka na server, pokušajte kasnije...`,
                toastSetup("top-right", 3000)
              );
            }
          }

          // Call the async function
          sendPostRequest();
        } else {
          if (ticketsIdWithoutSeat.length === 1) {
            toast.error(
              `Odaberite mjesto na ulaznici: ${ticketsIdWithoutSeat}`,
              toastSetup("top-right", 3000)
            );
          } else
            toast.error(
              `Odaberite mjesto na ulaznicama: ${ticketsIdWithoutSeat}`,
              toastSetup("top-right", 3000)
            );
        }
      } else {
        setToolTipOpen(true);
        setTimeout(() => {
          setToolTipOpen(false);
        }, 2000);
        if (ticketsIdWithoutEmail.length === 1) {
          toast.error(
            `Niste potvrdili email za ulaznicu: ${ticketsIdWithoutEmail}`,
            toastSetup("top-right", 3000)
          );
        } else
          toast.error(
            `Niste potvrdili email za ulaznice: ${ticketsIdWithoutEmail}`,
            toastSetup("top-right", 3000)
          );
      }
    }
  };

  return (
    <div className="single-page-container">
      <div className="single-page-top">
        <img
          src={
            concertData?.poster?.landscape
              ? `${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.landscape}`
              : ""
          }
          alt="concertData.poster.landscape"
        />

        <div className="cover-overlay"></div>
      </div>
      <div className="buy-container">
        <div className="left">
          <div className="top-buy-page">
            <div className="info">
              <h3>{concertData.performer_name}</h3>
              <p className="card-main-info">
                {timeOfEvent} - {concertData?.place?.city},{" "}
                {concertData?.place?.place}
              </p>
            </div>
            <img
              className="info-buy-page-image"
              src={
                concertData?.poster?.landscape
                  ? `${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.landscape}`
                  : ""
              }
              alt="concertData.poster.landscape"
            />
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
                <Personalization
                  key={i}
                  i={i}
                  concertData={concertData}
                  profileData={profileData}
                  setShowPaymentForm={setShowPaymentForm}
                  toolTipOpen={ticketsIdWithoutEmail.includes(i + 1)}
                />
              ))}
            </Carousel>
          </div>
        </div>
        <div className="right">
          <img
            src={
              concertData?.poster?.landscape
                ? `${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.landscape}`
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
            <p>Ukupna cijena:</p>
            <span>
              {totalAmount} <small> BAM</small>
            </span>
          </div>
          <div className="payment-method">
            <button className="pay-method" onClick={handleButtonClick}>
              Plati
            </button>
            {showPaymentForm && (
              <PaymentForm
                totalAmount={totalAmount}
                profileData={profileData}
                orderNumber={orderNumber}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
