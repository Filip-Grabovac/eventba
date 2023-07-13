import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTicket } from "../../store/ticketSlice";
import { PlanWrapper } from "./PlanWrapper";
import { Tooltip } from "react-tooltip";

export const Personalization = ({
  i,
  toolTipOpen,
  setShowPaymentForm,
  profileData,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState(profileData?.name || "");
  const [surname, setSurname] = useState(profileData?.lname || "");
  const [email, setEmail] = useState(profileData?.email || "");
  const dispatch = useDispatch();
  const ticketID = i + 1;
  const ticket = {
    id: ticketID,
    name: name,
    lname: surname,
    email: email,
    price: 0,
  };
  useEffect(() => {
    dispatch(addTicket(ticket));
  }, []);

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
                content={`Unesite ime i prezime vlasnika ulaznice ${i + 1}`}
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
                  content={`Potvrdite email na koji će ulaznica ${
                    i + 1
                  } biti poslana!`}
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

      <h4 className="choose-place">Odaberi mjesto:</h4>
      <PlanWrapper ticketID={ticketID} />
      <h4 className="choose-place">{`Cijena ulaznice: ${
        curentTicket ? curentTicket.price : 0
      } €`}</h4>
    </div>
  );
};
