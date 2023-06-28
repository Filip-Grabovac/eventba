import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Encrypt } from "../../auth/Encrypt";
import axios from "axios";
import { toast } from "react-toastify";

export function ProfileForm(props) {
  const profileData = props.profileData;
  const [name, setName] = useState(profileData.name);
  const [lname, setLname] = useState(profileData.lname);
  const [email, setEmail] = useState(profileData.email);
  const [city, setCity] = useState(profileData.city);
  const [country, setCountry] = useState(profileData.country);
  const [zip, setZip] = useState(profileData.zip);
  const [phone, setPhone] = useState(profileData.phone);
  const [address, setAddress] = useState(profileData.address);
  const [password, setPassword] = useState("");
  const [repatePassword, setRepatePassword] = useState("");

  const id = useSelector((state) => state.userState.user);
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      name: name,
      lname: lname,
      email: email,
      address: address,
      city: city,
      country: country,
      zip: zip,
      phone: phone,
      password: password,
    };

    if (password.length >= 6 && password === repatePassword) {
      await axios
        .patch(
          process.env.REACT_APP_API_URL + `/api/v1/users/${id}`,
          {
            ...user,
            password: Encrypt(user.password, secretKey),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          toast.success("Uspješno ste ažurirali podatke", toastSetup);
          props.onProfileFormSubmit();
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error:");
          toast.error(
            `Došlo je do pogreške prilikom ažuriranja podatak. ${error.response.data.error}!`,
            toastSetup
          );
        });
    } else {
      toast.warn(
        "Lozinke se ne poklapaju ili su kraće od 6 znamenki!",
        toastSetup
      );
    }
  };

  const toastSetup = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  return (
    <div className="profile-form">
      <form className="form container" onSubmit={handleSubmit}>
        <div className="row">
          <div className=" col">
            <input
              placeholder="Ime"
              type="text"
              id="name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className=" col">
            <input
              placeholder="Prezime"
              type="text"
              id="lname"
              value={lname || ""}
              onChange={(e) => setLname(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className=" col">
            <input
              placeholder="Email"
              type="email"
              id="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className=" col">
            <input
              placeholder="Grad"
              type="text"
              id="city"
              value={city || ""}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className=" col">
            <input
              placeholder="Država"
              type="text"
              id="country"
              value={country || ""}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className=" col">
            <input
              placeholder="Zip"
              type="text"
              id="zip"
              value={zip || ""}
              onChange={(e) => setZip(e.target.value)}
              required
            />
          </div>
          <div className=" col">
            <input
              placeholder="Mobitel"
              type="text"
              id="phone"
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className=" col">
            <input
              placeholder="Adresa"
              type="address"
              id="address"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className=" col">
            <input
              placeholder="Nova lozinka"
              type="password"
              id="password"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className=" col">
            <input
              placeholder="Ponovi lozinku"
              type="password"
              id="repatePassword"
              value={repatePassword || ""}
              onChange={(e) => setRepatePassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">
          <button type="submit">Spremi promjene</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
