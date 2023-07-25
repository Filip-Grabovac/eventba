import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Encrypt } from "../../../auth/Encrypt";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import hr from "../../../components/helper/hr";
import countryMap from "../../../components/helper/countryMap";
import { toastSetup } from "../../../functions/toastSetup";

export const UpdateProfilePage = (props) => {
  const profileData = props.profileData;
  const [name, setName] = useState(profileData.name);
  const [lname, setLname] = useState(profileData.lname);
  const [email, setEmail] = useState(profileData.email);
  const [city, setCity] = useState(profileData.city);
  const [zip, setZip] = useState(profileData.zip);
  const [address, setAddress] = useState(profileData.address);
  const [password, setPassword] = useState("");
  const [repatePassword, setRepatePassword] = useState("");

  const [phone, setPhone] = useState(profileData.phone);
  const reverseCountry = (fullName) => {
    for (const code in countryMap) {
      if (countryMap[code] === fullName) {
        return code;
      }
    }
    return null; // Return null if the country name is not found in the map
  };
  const [country, setCountry] = useState(
    reverseCountry(profileData.country) || "BA"
  );
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
      country: countryMap[country],
      zip: zip,
      phone: phone,
      password: password !== "" ? Encrypt(password, secretKey) : undefined,
    };

    if (
      password !== "" &&
      password.length >= 6 &&
      password === repatePassword
    ) {
      await axios
        .patch(process.env.REACT_APP_API_URL + `/api/v1/users/${id}`, user, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          toast.success(
            "Uspješno ste ažurirali podatke",
            toastSetup("top-right", 2000)
          );
          props.onProfileFormSubmit();
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error:");
          toast.error(
            `Došlo je do pogreške prilikom ažuriranja podataka. ${error.response.data.error}!`,
            toastSetup("top-right", 2000)
          );
        });
    } else if (password === "") {
      // Ako je lozinka prazna, samo se ažuriraju ostali podaci

      await axios
        .patch(process.env.REACT_APP_API_URL + `/api/v1/users/${id}`, user, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          toast.success(
            "Uspješno ste ažurirali podatke",
            toastSetup("top-right", 2000)
          );
          props.onProfileFormSubmit();
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error:");

          toast.error(
            `Došlo je do pogreške prilikom ažuriranja podataka. ${error.response.data.error}!`,
            toastSetup("top-right", 2000)
          );
        });
    } else {
      toast.warn(
        "Lozinke se ne podudaraju ili su kraće od 6 znamenki!",
        toastSetup("top-right", 2000)
      );
    }
  };

  return (
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
            placeholder="Zip"
            type="text"
            id="zip"
            value={zip || ""}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="row">
        <div className=" phone-col col">
          <PhoneInput
            placeholder="Mobitel"
            value={phone || ""}
            onChange={setPhone}
            onCountryChange={setCountry}
            defaultCountry={country || "BA"}
            international={true}
            countryCallingCodeEditable={false}
            label={country}
            countryOptionsOrder={[
              "BA",
              "HR",
              "RS",
              "AL",
              "BG",
              "GR",
              "XK",
              "ME",
              "MK",
              "RO",
              "SI",
              "DE",
              "AT",
              "IT",
            ]}
            labels={hr}
            locales="hr"
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
          />
        </div>

        <div className=" col">
          <input
            placeholder="Ponovi lozinku"
            type="password"
            id="repatePassword"
            value={repatePassword || ""}
            onChange={(e) => setRepatePassword(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <button type="submit">Spremi promjene</button>
      </div>
    </form>
  );
};
