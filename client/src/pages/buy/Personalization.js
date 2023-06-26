import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../store/ticketSlice";

import Plan from "../../assets/event_ground_plans/concert_ground_plan.png";
import FreeSeat from "../../assets/ikonice/free_seat.svg";
import ReservedSeat from "../../assets/ikonice/reserverd_seat.svg";
import { Seat } from "./Seat";

export const Personalization = ({ i }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const userId = useSelector((state) => state.userState);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/id/${userId}`
        );
        setProfileData(response.data);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, surname, email, i + 1);
  };

  return (
    <div className="personalization">
      <div className="person-check-flex">
        <h4>Personalizacija</h4>

        <input
          className="checkbox"
          onChange={() => setIsChecked(!isChecked)}
          type="checkbox"
          name="checkbox"
        />
      </div>
      <div className="profile-form">
        <form className="form container" onSubmit={handleSubmit}>
          <div className="row">
            <div className="item1 col">
              <input
                disabled={!isChecked}
                placeholder="Ime"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="item2 col">
              <input
                disabled={!isChecked}
                placeholder="Prezime"
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="item3 col">
              <input
                disabled={!isChecked}
                placeholder="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <button
              onClick={useDispatch(
                add({ name: name, lname: surname, email: email, id: i })
              )}
              className="item7"
              type="submit"
            >
              Spremi promjene
            </button>
          </div>
        </form>
      </div>

      <div className="plan-wrapper">
        <Seat seatAvailability={FreeSeat} seatId="seat1" seattype="vip" />
        <Seat seatAvailability={FreeSeat} seatId="seat2" seattype="normal" />
        <Seat seatAvailability={FreeSeat} seatId="seat3" seattype="normal" />
        <Seat seatAvailability={FreeSeat} seatId="seat4" seattype="normal" />
        <Seat seatAvailability={FreeSeat} seatId="seat5" seattype="normal" />
        <Seat seatAvailability={ReservedSeat} seatId="seat6" />
        <Seat seatAvailability={ReservedSeat} seatId="seat7" seattype="vip" />
        <Seat seatAvailability={ReservedSeat} seatId="seat8" seattype="vip" />
        <Seat
          seatAvailability={ReservedSeat}
          seatId="seat9"
          seattype="normal"
        />
        <Seat
          seatAvailability={ReservedSeat}
          seatId="seat10"
          seattype="normal"
        />
        <Seat
          seatAvailability={ReservedSeat}
          seatId="seat11"
          seattype="normal"
        />
        <img
          className="event-plan"
          src={Plan}
          alt="Event plan"
          seattype="normal"
        />
      </div>
    </div>
  );
};
