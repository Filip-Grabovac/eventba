import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import X from "../assets/ikonice/X.svg";
import facebook from "../assets/ikonice/facebook.svg";
import gmail from "../assets/ikonice/gmail.svg";
import invisible from "../assets/ikonice/invisible.svg";
import mail from "../assets/ikonice/mail.svg";

export const Login = ({ isLoginOpen, setIsLoginOpen }) => {
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
  const handleSubmit = (e) => {
    e.preventDefault();
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
            <div className="email">
              <input
                placeholder="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <img className="input-img" src={mail} alt="" />
            </div>
            <div className="pass">
              <input
                placeholder="Lozinka"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img className="input-img" src={invisible} alt="" />
            </div>
            <div className="other-login">
              <div className="facebook">
                <img src={facebook} alt="Facebook logo" />
                <p>Nastavi sa Facebook-om</p>
              </div>

              <div className="gmail">
                <img src={gmail} alt="" />
                <p>Nastavi sa Gmail-om</p>
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
