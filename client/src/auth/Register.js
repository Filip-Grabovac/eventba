import React, { useEffect, useState } from "react";
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

export const Register = ({ isRegisterOpen, setIsRegisterOpen }) => {
  const [verified, setVerified] = useState(false);
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        .then((response) => {
          toast.success("Uspješna registracija", toastSetup);
          setIsRegisterOpen(false);
        })

        .catch((error) => {
          // Handle any errors
          console.error("Error:");
          toast.error(
            `Došlo je do pogreške prilikom registracije. ${error.response.data.error}!`,
            toastSetup
          );
        });
    } else toast.warn("Lozinke se ne poklapaju!", toastSetup);
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("login-screen")) {
      setIsRegisterOpen(false);
    }
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
          <form onSubmit={handleSubmit}>
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
                placeholder="Država"
                type="text"
                icon=""
                name="country"
                isRequired={false}
              />
            </div>
            <div className="multiple-inputs-wrapper">
              <RegisterInput
                placeholder="Poštanski broj"
                type="text"
                icon=""
                name="zipcode"
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
              inputLength={8}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
            <RegisterInput
              placeholder="Ponovi Lozinku"
              type="password"
              icon=""
              name="repeatPassword"
              isRequired={true}
              inputLength={8}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
            <p>
              Već imas event.ba račun? <Link>Prijavi se.</Link>
            </p>
            <ReCAPTCHA
              className="recaptcha"
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={onChange}
            />
            <button type="submit" className="login-btn" disabled={!verified}>
              Registruj se!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
