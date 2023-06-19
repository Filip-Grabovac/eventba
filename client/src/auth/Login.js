import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RegisterInput } from "./RegisterInput";
import X from "../assets/ikonice/X.svg";
import facebook from "../assets/ikonice/facebook.svg";
import gmail from "../assets/ikonice/gmail.svg";
import invisible from "../assets/ikonice/invisible.svg";
import mail from "../assets/ikonice/mail.svg";

export const Login = ({ isLoginOpen, setIsLoginOpen }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        setIsLoginOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [setIsLoginOpen]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
  };
  const handleModalClick = (e) => {
    if (e.target.classList.contains("login-screen")) {
      setIsLoginOpen(false);
    }
  };
  return (
    <div className="login-screen" onClick={handleModalClick}>
      <div className="container">
        <button
          className="close-btn"
          onClick={() => {
            setIsLoginOpen(!isLoginOpen);
          }}
        >
          <img src={X} alt="" />
        </button>
        <h2>Prijava</h2>
        <div className="text-section">
          <form onSubmit={handleSubmit}>
            <RegisterInput
              placeholder="Email"
              type="email"
              icon={mail}
              name="email"
              isRequired={true}
            />
            <RegisterInput
              placeholder="Lozinka"
              type="password"
              icon={invisible}
              name="password"
              isRequired={true}
              inputLength={8}
              cursorPointer={true}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
            <div className="other-login">
              <div className="facebook">
                <img src={facebook} alt="Facebook logo" />
                <p>Nastavi sa Facebook-om</p>
              </div>
            </div>
            <p>
              Nemaš event.ba račun? <Link>Registriraj</Link> se!
            </p>
            <button type="submit" className="login-btn">
              Prijavi se!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
