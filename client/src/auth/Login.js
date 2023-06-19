import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RegisterInput } from "./RegisterInput";
import X from "../assets/ikonice/X.svg";
import facebook from "../assets/ikonice/facebook.svg";
import invisible from "../assets/ikonice/invisible.svg";
import mail from "../assets/ikonice/mail.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { Encrypt } from "./Encrypt";
import { Decrypt } from "./Decrypt";

export const Login = ({ isLoginOpen, setIsLoginOpen }) => {
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

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  // Around modal click exit login
  const handleModalClick = (e) => {
    if (e.target.classList.contains("login-screen")) {
      setIsLoginOpen(false);
    }
  };
  // Press escape key exit login
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

  // Handle submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    console.log(email);
    try {
      const { data: userPasword } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(userPasword);
      if (
        Decrypt(userPasword, secretKey) === e.target.elements.password.value
      ) {
        toast.success("Uspješana prijava", toastSetup);
        setIsLoginOpen(false);
      } else {
        toast.error(`Lozinka nije ispravna`, toastSetup);
      }
    } catch (error) {
      console.error(error);

      if (error) {
        toast.error(
          `Došlo je do pogreške prilikom prijave. ${error.response.data.error}!`,
          toastSetup
        );
      } else {
        toast.error("Došlo je do pogreške prilikom registracije.", toastSetup);
      }
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
