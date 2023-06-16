import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import X from "../assets/ikonice/X.svg";
import { RegisterInput } from "./RegisterInput";
import UserCard from "../assets/ikonice/user_card_icon.svg";
import Mail from "../assets/ikonice/mail.svg";
import PinIcon from "../assets/ikonice/pin_icon.svg";
import PasswordEye from "../assets/ikonice/invisible.svg";

export const Register = ({ isRegisterOpen, setIsRegisterOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
  };
  const handleModalClick = (e) => {
    if (e.target.classList.contains("login-screen")) {
      setIsRegisterOpen(false);
    }
  };
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
              <RegisterInput placeholder="Ime" type="text" icon={UserCard} />
              <RegisterInput
                placeholder="Prezime"
                type="text"
                icon={UserCard}
              />
            </div>
            <RegisterInput placeholder="Email" type="email" icon={Mail} />
            <RegisterInput placeholder="Adresa" type="text" icon={PinIcon} />
            <div className="multiple-inputs-wrapper">
              <RegisterInput placeholder="Grad" type="text" icon="" />
              <RegisterInput placeholder="Država" type="text" icon="" />
            </div>
            <div className="multiple-inputs-wrapper">
              <RegisterInput placeholder="Poštanski broj" type="text" icon="" />
              <RegisterInput placeholder="Telefon" type="text" icon="" />
            </div>
            <RegisterInput
              placeholder="Lozinka"
              type="password"
              icon={PasswordEye}
            />
            <RegisterInput
              placeholder="Ponovi Lozinku"
              type="password"
              icon=""
            />
            <p>
              Već imas event.ba račun? <Link>Prijavi se.</Link>
            </p>
            <button type="submit" className="login-btn">
              Registruj se!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
