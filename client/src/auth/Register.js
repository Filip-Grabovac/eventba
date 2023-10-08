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
import { useCloseModalOnEsc } from "../functions/closeModalOnEsc";
// Phone Input
import PhoneInput from "react-phone-number-input";
import countryMap from "../components/helper/countryMap";
import hr from "../components/helper/hr";
import { setLoginIsOpen } from "../store/loginSlice";
export const Register = ({ isRegisterOpen, setIsRegisterOpen }) => {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const repeatPasswordRef = useRef(null);
  const emailRef = useRef(null);
  // Phone Input settings
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [country, setCountry] = useState("BA");

  // Press escape key exit register
  // useCloseModalOnEsc(setIsRegisterOpen);
  // Register a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      toast.error(
        "Niste potvrdili da se slažete s uvijetima korištenja.",
        toastSetup("top-right", 3000)
      );
      return;
    }
    if (!agreed) {
      toast.error(
        "Niste potvrdili da niste robot.",
        toastSetup("top-right", 3000)
      );
      return;
    }
    const user = {
      full_name:
        e.target.elements.name.value + " " + e.target.elements.lname.value,
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
      buy_history: [],
      is_banned: false,
      newsletter: false,
    };

    if (Decrypt(user.password, secretKey) === user.repeatPassword) {
      await axios
        .post(
          process.env.REACT_APP_API_URL + "/api/v1/users",
          {
            ...user,
            is_verified: false,
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

    dispatch(setLoginIsOpen(true));
  };

  function onChange() {
    setVerified(true);
  }

  const handleCheckboxChange = (event) => {
    setAgreed(event.target.checked);
  };

  return (
    <div className="login-box">
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
              <div className="terms-of-use-container">
                <p>Pročitao sam i slažem se s uvijetima korištenja</p>
                <input
                  className="terms-of-use"
                  type="checkbox"
                  checked={agreed}
                  onChange={handleCheckboxChange}
                />
              </div>
              <ReCAPTCHA
                style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  height: "75px",
                  width: "295px",

                  marginBottom: "15px",
                }}
                className="recaptcha"
                sitekey="6LeMm1MnAAAAAOElXfMI6txzQnUG3q2F4QVUnYYq"
                onChange={onChange}
                theme="dark"
              />

              <button
                type="submit"
                className="login-btn"
                disabled={!verified || !agreed}
              >
                Registriraj se!
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
