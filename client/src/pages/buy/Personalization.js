import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addTicket } from "../../store/ticketSlice";
import { PlanWrapper } from "./PlanWrapper";
import { Tooltip } from "react-tooltip";
import { addTicketPrice } from "../../store/ticketSlice";
export const Personalization = ({
  i,
  toolTipOpen,
  setShowPaymentForm,
  profileData,
  concertData,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState(profileData?.name || "");
  const [surname, setSurname] = useState(profileData?.lname || "");
  const [email, setEmail] = useState(profileData?.email || "");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const dispatch = useDispatch();
  const ticketID = i + 1;

  useEffect(() => {
    const ticket = {
      id: ticketID,
      name: name,
      lname: surname,
      email: email,
      price: 0,
    };
    dispatch(addTicket(ticket));
  }, []);

  const handleClick = (category) => {
    setActiveCategory(category);

    const ticketType = concertData.tickets.type[category];
    const price = ticketType.price;
    console.log(ticketType);
    setTicketPrice(price);
    dispatch(
      addTicketPrice({
        ticketPrice: Number(price),
        ticketID,
        category,
        name: ticketType.name,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const saveTicketData = () => {
    setShowPaymentForm(false);
    dispatch(
      addTicket({
        id: i + 1,
        name: name,
        lname: surname,
        email: email,
      })
    );
  };
  const curentTicket = useSelector((state) =>
    state.ticketState.ticketList.find((ticket) => ticket.id === ticketID)
  );

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className="personalization">
      <div className="person-check-flex">
        <h4 className="">Personalizacija</h4>

        <input
          id={`checkbox-${i}`}
          className="checkbox"
          onChange={handleCheckboxChange}
          type="checkbox"
          name="checkbox"
        />
        <Tooltip
          style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
          anchorId={`checkbox-${i}`}
          place="top"
          variant="info"
          content="Presonalizirajte ulaznicu."
        />
      </div>
      {isChecked ? (
        <div className="profile-form">
          <form className="form container" onSubmit={handleSubmit}>
            <div className="row">
              <div className="item1 col">
                <input
                  disabled={!isChecked}
                  placeholder="Ime"
                  type="text"
                  id={`name-${i}`}
                  value={!isChecked ? "" : name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <Tooltip
                style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
                anchorId={`name-${i}`}
                place="top"
                variant="info"
                content={`Unesite ime vlasnika ulaznice ${i + 1}`}
              />
              <div className="item2 col">
                <input
                  disabled={!isChecked}
                  placeholder="Prezime"
                  type="text"
                  id="surname"
                  value={!isChecked ? "" : surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="item3 col">
                <input
                  placeholder="Email"
                  type="email"
                  id={`email-${i}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Tooltip
                  style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
                  anchorId={`email-${i}`}
                  place="bottom"
                  variant="info"
                  content={`Email na koji će ulaznica ${i + 1} biti poslana!`}
                />
              </div>
            </div>

            <div className="row">
              <button
                id={`button-${i}`}
                onClick={saveTicketData}
                className="item7"
                type="submit"
              >
                Spremi promjene
              </button>
              <Tooltip
                style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
                anchorId={`button-${i}`}
                place="bottom"
                variant="info"
                content={"Spremite podatke o ulaznici"}
                isOpen={toolTipOpen}
                delayShow={2000}
              />
            </div>
          </form>
        </div>
      ) : (
        ""
      )}

      <h4 className="choose-place">Odaberi ulaznicu:</h4>
      {concertData?.place?.type === "hall" ? (
        <div className="ticket-card">
          {concertData.tickets &&
            concertData.tickets.type &&
            Object.keys(concertData.tickets.type).map((category) => {
              const ticketType = concertData.tickets.type[category];
              return (
                <div
                  className={
                    activeCategory === category
                      ? "ticket-card-inner active"
                      : "ticket-card-inner"
                  }
                  onClick={() => handleClick(category)}
                  key={category}
                >
                  <div className={`ticket-card-name ${ticketType.name}`}>
                    {ticketType.name}
                  </div>
                  <div className="ticket-card-content">
                    <div>
                      Cijena: {ticketType.price}
                      <small> BAM</small>
                    </div>
                    <div>Preostalo: {ticketType.amount}</div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <>
          <PlanWrapper ticketID={ticketID} />
          <h4 className="choose-place">
            {`Cijena ulaznice: ${curentTicket ? curentTicket.price : 0}`}{" "}
            <small> BAM</small>
          </h4>
        </>
      )}
    </div>
  );
};
