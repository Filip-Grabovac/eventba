import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import X from "../assets/ikonice/X.svg";
import { RegisterInput } from "./RegisterInput";
import UserCard from "../assets/ikonice/user_card_icon.svg";
import Mail from "../assets/ikonice/mail.svg";
import PinIcon from "../assets/ikonice/pin_icon.svg";
import PasswordEye from "../assets/ikonice/invisible.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { Encrypt } from "./Encrypt";
import { Decrypt } from "./Decrypt";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { setUserID } from "../store/userSlice";
import { toastSetup } from "../functions/toastSetup";

export const Register = ({
  isRegisterOpen,
  setIsRegisterOpen,
  setIsLoginOpen,
}) => {
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const repeatPasswordRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        setIsRegisterOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [setIsRegisterOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const user = {
      name: e.target.elements.name.value,
      lname: e.target.elements.lname.value,
      email: e.target.elements.email.value,
      address: e.target.elements.address.value,
      city: e.target.elements.city.value,
      country: e.target.elements.country.value,
      role: "standard",
      zip: e.target.elements.zipcode.value,
      phone: e.target.elements.phoneNumber.value,
      password: Encrypt(e.target.elements.password.value, secretKey),
      repeatPassword: e.target.elements.repeatPassword.value,
    };

    if (Decrypt(user.password, secretKey) === user.repeatPassword) {
      await axios
        .post(
          process.env.REACT_APP_API_URL + "/api/v1/users",
          {
            ...user,
            isVerified: false,
            verificationCode: Math.floor(Math.random() * 100000000) + 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          toast.success("Uspješna registracija", toastSetup("top-right", 3000));
          setIsRegisterOpen(false);

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

  function onChange(value) {
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
            <div className="multiple-inputs-wrapper">
              <RegisterInput
                placeholder="Država"
                type="text"
                icon=""
                name="country"
                isRequired={false}
              />
              <RegisterInput
                placeholder="Telefon"
                type="text"
                icon=""
                name="phoneNumber"
                isRequired={false}
              />
            </div>
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
