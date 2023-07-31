import React, { useEffect, useRef, useState } from "react";
import minus from "../../assets/ikonice/minus.svg";
import plus from "../../assets/ikonice/plus.svg";
import Carousel from "react-elastic-carousel";
import { Personalization } from "./Personalization";
import { TicketBill } from "./TicketBill";
import { removeLastTicket, resetState } from "../../store/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import PaymentForm from "./PaymentForm";
import axios from "axios";
import { toast } from "react-toastify";
import { toastSetup } from "../../functions/toastSetup";
import { hrTimeFormat } from "../../components/helper/timeFormat";
import { setLoginIsOpen } from "../../store/loginSlice";

export const BuyPage = () => {
  const [concertData, setConcertData] = useState({});
  const [ticketAmount, setTicketAmount] = useState(1);
  const carouselRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const dispatch = useDispatch();
  const activeCardRef = useRef(null);
  const allTickets = useSelector((state) => state.ticketState.ticketList);
  const loggedinUser = useSelector((state) => state.userState.user);

  const userId = useSelector((state) => state.userState.user);
  // Setting order number 1. time u get on buy page
  useEffect(() => {
    setOrderNumber(Math.floor(Math.random() * 10000000000000) + 1);
    dispatch(resetState());
    fetchConcertData();
    if (userId !== "") {
      fetchProfileData();
    }
  }, [userId]);

  const totalAmount = useSelector((state) => state.ticketState.totalAmount);
  const ticketGenData = useSelector((state) => state.ticketState);

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
    setShowPaymentForm(false);
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

  const fetchConcertData = async () => {
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

  const date = new Date(concertData.time_of_event).toLocaleString(
    "hr-HR",
    hrTimeFormat
  );
  const timeOfEvent = date.charAt(0).toUpperCase() + date.slice(1);

  // Update the areEnoughTicketsAvailable function to return the category with not enough tickets
  const areEnoughTicketsAvailable = (concertData, ticketGenData) => {
    const missingCategories = new Set();

    for (const ticket of ticketGenData.ticketList) {
      const category = String(ticket?.category);
      const concertTickets =
        concertData.tickets.online_sale.type[category]?.amount;
      const ticketCount = ticketGenData.ticketList.filter(
        (t) => t.category === category
      ).length;

      if (concertTickets >= ticketCount) {
        // Enough tickets available for this category
        continue;
      } else {
        // Not enough tickets available for this category
        const ticketName = ticketGenData.ticketList.find(
          (t) => t.category === category
        )?.ticketName;
        missingCategories.add(ticketName || category);
      }
    }

    return Array.from(missingCategories);
  };

  // BUY BUTTON
  // Chek if mails are there, to enable pay button
  const handleButtonClick = async () => {
    await fetchConcertData();
    if (userId === "") {
      dispatch(setLoginIsOpen(true));

      return;
    }
    profileData?.isVerified || fetchProfileData();

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
    const categoryWithNotEnoughTickets = areEnoughTicketsAvailable(
      concertData,
      ticketGenData
    );

    {
      if (ticketsIdWithoutEmail.length === 0) {
        if (ticketsIdWithoutSeat.length === 0) {
          if (categoryWithNotEnoughTickets.length === 0) {
            setShowPaymentForm(true);

            const allEmails = allTickets.map((ticket) => ticket.email);
            const uniqueEmails = allEmails.filter((email, index) => {
              return allEmails.indexOf(email) === index;
            });

            const timeOfToast = uniqueEmails * 2000;

            toast.success(
              `Vaše ${
                ticketAmount === 1
                  ? "ulaznica će biti poslana"
                  : "ulaznice će biti poslane"
              }  na ${
                uniqueEmails.length === 1 ? "mail" : "mailove"
              }:\n${uniqueEmails.join("\n")}. Odaberite način plaćanja.`,
              toastSetup("top-right", timeOfToast)
            );

            async function sendPostRequest() {
              try {
                // Send the POST request using Axios and wait for the response
                await axios.post(
                  `${process.env.REACT_APP_API_URL}/api/v1/payment/get_ticket_data`,
                  {
                    ticketGenData: ticketGenData,
                    concertData: concertData,
                    orderNumber,
                    loggedinUser: loggedinUser,
                  }
                );
                console.log({
                  ticketGenData: ticketGenData,
                  concertData: concertData,
                  orderNumber,
                  loggedinUser: loggedinUser,
                });
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
            {
              toast.error(
                `Nema dovoljno ulaznica za ${
                  categoryWithNotEnoughTickets.length === 1
                    ? "kategoriju"
                    : "kategorije"
                }: ${categoryWithNotEnoughTickets}.`,
                toastSetup("top-right", 3000)
              );
            }
          }
        } else {
          if (ticketsIdWithoutSeat.length === 1) {
            toast.error(
              `Odaberite tip za ulaznicu: ${ticketsIdWithoutSeat}`,
              toastSetup("top-right", 3000)
            );
          } else
            toast.error(
              `Odaberite tip na ulaznicama: ${ticketsIdWithoutSeat}`,
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
            `Niste unijeli email za ulaznicu: ${ticketsIdWithoutEmail}`,
            toastSetup("top-right", 3000)
          );
        } else
          toast.error(
            `Niste unijeli email za ulaznice: ${ticketsIdWithoutEmail}`,
            toastSetup("top-right", 3000)
          );
        if (profileData && !profileData.isVerified) {
          toast.error(
            `Verificirajte vaš račun na: "${profileData.email}" da biste mogli obaviti kupovinu!`,
            toastSetup("top-right", 3000)
          );
        }
      }
    }
  };
  useEffect(() => {
    // Check if showPaymentForm is true and click the button if it is
    if (showPaymentForm) {
      // Function to handle the click logic when the button is found
      const clickButton = () => {
        const buttonElement = document.querySelector(
          ".monri-lightbox-button-el"
        );
        if (buttonElement) {
          buttonElement.click();
        } else {
          // Retry after a short delay if the button is not found yet
          setTimeout(clickButton, 200);
        }
      };

      // Call the clickButton function to start the click logic
      clickButton();
    }
  }, [showPaymentForm]);

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
                  ticketAmount={ticketAmount}
                  concertData={concertData}
                  profileData={profileData}
                  setShowPaymentForm={setShowPaymentForm}
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
              Idi na plaćanje
            </button>
            {showPaymentForm && (
              <PaymentForm
                showPaymentForm={showPaymentForm}
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
