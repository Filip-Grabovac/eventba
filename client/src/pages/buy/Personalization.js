import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTicket } from "../../store/ticketSlice";
import { PlanWrapper } from "./PlanWrapper";

export const Personalization = ({ i }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const userId = useSelector((state) => state.userState.user);
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
  };

  const saveTicketData = () => {
    dispatch(
      addTicket({
        id: i + 1,
        name: name,
        lname: surname,
        email: email,
      })
    );
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
                value={!isChecked ? "" : name}
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
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <button onClick={saveTicketData} className="item7" type="submit">
              Spremi promjene
            </button>
          </div>
        </form>
      </div>
      <PlanWrapper ticketID={ticketID} />
    </div>
  );
};
