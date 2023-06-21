import React, { useState } from "react";

export function ProfileForm(props) {
  const profileData = props.profileData;
  const [name, setName] = useState(profileData.name);
  const [surname, setSurname] = useState(profileData.lname);
  const [email, setEmail] = useState(profileData.email);
  const [city, setCity] = useState(profileData.city);
  const [country, setCountry] = useState(profileData.country);
  const [adress, setAdress] = useState(profileData.address);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted:", { name, surname, email, city, country });
  };

  return (
    <div className="profile-form">
      <form className="form container" onSubmit={handleSubmit}>
        <div className="row">
          <div className="item1 col">
            <label htmlFor="name">Ime:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="item2 col">
            <label htmlFor="surname">Prezime:</label>
            <input
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="item4 col">
            <label htmlFor="city">Grad:</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="item5 col">
            <label htmlFor="country">Država:</label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="item6 col">
            <label htmlFor="adress">Adresa:</label>
            <input
              type="adress"
              id="adress"
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
              required
            />
          </div>
        </div>

        <button className="item7" type="submit">
          Spremi promjene
        </button>
      </form>
    </div>
  );
}

export default ProfileForm;
