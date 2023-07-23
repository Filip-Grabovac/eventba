import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
// Images
import X from "../assets/ikonice/X.svg";
import UserCard from "../assets/ikonice/user_card_icon.svg";
import Mail from "../assets/ikonice/mail.svg";
import PinIcon from "../assets/ikonice/pin_icon.svg";
import PasswordEye from "../assets/ikonice/invisible.svg";
// Redux
import { useDispatch } from "react-redux";
import { setUserID } from "../store/userSlice";
// Components
import { Link } from "react-router-dom";
import { RegisterInput } from "./RegisterInput";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
// Functions
import { Encrypt } from "./Encrypt";
import { Decrypt } from "./Decrypt";
import { toastSetup } from "../functions/toastSetup";
import { closeModalOnEsc } from "../functions/closeModalOnEsc";
// Phone Input
import PhoneInput from "react-phone-number-input";
import countryMap from "../components/helper/countryMap";

export const Register = ({
  isRegisterOpen,
  setIsRegisterOpen,
  setIsLoginOpen,
}) => {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const repeatPasswordRef = useRef(null);
  const emailRef = useRef(null);
  // Phone Input settings
  const [phone, setPhone] = useState("");
  const reverseCountry = (fullName) => {
    for (const code in countryMap) {
      if (countryMap[code] === fullName) {
        return code;
      }
    }
    return null; // Return null if the country name is not found in the map
  };
  const [country, setCountry] = useState("BA");

  // Press escape key exit register
  useEffect(() => {
    closeModalOnEsc(setIsRegisterOpen);
  }, [setIsRegisterOpen]);

  // Register a user
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      name: e.target.elements.name.value,
      lname: e.target.elements.lname.value,
      email: e.target.elements.email.value,
      fbEmail: e.target.elements.email.value,
      address: e.target.elements.address.value,
      city: e.target.elements.city.value,
      country: countryMap[country],
      role: "standard",
      zip: e.target.elements.zipcode.value,
      phone: phone,
      password: Encrypt(e.target.elements.password.value, secretKey),
      repeatPassword: e.target.elements.repeatPassword.value,
      buyHistory: [],
    };

    if (Decrypt(user.password, secretKey) === user.repeatPassword) {
      await axios
        .post(
          process.env.REACT_APP_API_URL + "/api/v1/users",
          {
            ...user,
            isVerified: false,
            verificationCode: Math.floor(Math.random() * 100000000000) + 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          toast.success(
            `Uspješna registracija. Provjerite ${user.email} zbog verifikacije!`,
            toastSetup("top-right", 3000)
          );
          setIsRegisterOpen(false);
          // Login user
          dispatch(setUserID(response.data.user._id));
          localStorage.setItem("userId", response.data.user._id);
        })
        .catch((error) => {
          // Handle any errors
          emailRef.current.focus();
          toast.error(
            `Došlo je do pogreške prilikom registracije. ${error.response.data.error}!`,
            toastSetup("top-right", 3000)
          );
        });
    } else {
      toast.warn("Lozinke se ne podudaraju!", toastSetup("top-right", 3000));
      repeatPasswordRef.current.focus();
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("login-screen")) {
      setIsRegisterOpen(false);
    }
  };

  const handleOpenLogin = (e) => {
    e.preventDefault();
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  function onChange() {
    setVerified(true);
  }

  return (
    <div className="login-screen" onClick={handleModalClick}>
      <div className="container">
        <button
          className="close-btn"
          onClick={() => {
            setIsRegisterOpen(!isRegisterOpen);
          }}
        >
          <img src={X} alt="" />
        </button>
        <h2>Registracija</h2>
        <div className="text-section">
          <form onSubmit={verified ? handleSubmit : undefined}>
            <div className="multiple-inputs-wrapper">
              <RegisterInput
                placeholder="Ime"
                type="text"
                icon={UserCard}
                name="name"
                isRequired={true}
                inputLength={3}
              />
              <RegisterInput
                placeholder="Prezime"
                type="text"
                icon={UserCard}
                name="lname"
                isRequired={true}
                inputLength={3}
              />
            </div>
            <RegisterInput
              placeholder="Email"
              ref={emailRef}
              type="email"
              icon={Mail}
              name="email"
              isRequired={true}
            />
            <RegisterInput
              placeholder="Adresa"
              type="text"
              icon={PinIcon}
              name="address"
              isRequired={false}
            />
            <div className="multiple-inputs-wrapper">
              <RegisterInput
                placeholder="Grad"
                type="text"
                icon=""
                name="city"
                isRequired={false}
              />
              <RegisterInput
                placeholder="Poštanski broj"
                type="text"
                icon=""
                name="zipcode"
                isRequired={false}
              />
            </div>

            <PhoneInput
              placeholder="Mobitel"
              value={phone || ""}
              onChange={setPhone}
              onCountryChange={setCountry}
              defaultCountry={country || "BA"}
              international={true}
              countryCallingCodeEditable={false}
              countryOptionsOrder={[
                "AL",
                "BA",
                "BG",
                "HR",
                "GR",
                "XK",
                "ME",
                "MK",
                "RO",
                "RS",
                "SI",
                "DE",
                "AT",
                "IT",
              ]}
            />

            <RegisterInput
              placeholder="Lozinka"
              type="password"
              icon={PasswordEye}
              cursorPointer={true}
              name="password"
              isRequired={true}
              inputLength={6}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
            <RegisterInput
              placeholder="Ponovi Lozinku"
              type="password"
              icon=""
              ref={repeatPasswordRef}
              name="repeatPassword"
              isRequired={true}
              inputLength={6}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
            <p>
              Imas event.ba račun?{" "}
              <Link onClick={handleOpenLogin}>Prijavi se.</Link>
            </p>
            <ReCAPTCHA
              className="recaptcha"
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={onChange}
            />
            <button type="submit" className="login-btn" disabled={!verified}>
              Registriraj se!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
