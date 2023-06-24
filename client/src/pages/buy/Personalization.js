import React, { useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";

export const Personalization = () => {
  const [profileData, setProfileData] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [email, setEmail] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [adress, setAdress] = useState();

  const userId = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/id/${userId}`
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted:", { name, surname, email, city, country });
  };
  return (
    <div className="profile-form">
      <form className="form container" onSubmit={handleSubmit}>
        <div className="row">
          <div className="item1 col">
            <input
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
          <div className="item6 col">
            <input
              placeholder="Adressa"
              type="adress"
              id="adress"
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <button className="item7" type="submit">
            Spremi promjene
          </button>
        </div>
      </form>
    </div>
  );
};
