import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RegisterInput } from "./RegisterInput";
import X from "../assets/ikonice/X.svg";
import facebook from "../assets/ikonice/facebook.svg";
import invisible from "../assets/ikonice/invisible.svg";
import mail from "../assets/ikonice/mail.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { Decrypt } from "./Decrypt";
import FacebookLogin from "react-facebook-login";
// REDUX
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions/index.js";

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
  const dispatch = useDispatch();
  const [loggedin, setState] = useState(false);
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

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/email/${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { id, password: userPassword } = response.data;
      if (
        Decrypt(userPassword, secretKey) === e.target.elements.password.value
      ) {
        dispatch(setUser(id));
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

  // FACEBOOK LOGIC
  const responseFacebook = (response) => {
    console.log(response);
    if (response.accessToken) {
      setState(true);
    }
  };

  const componentClicked = () => {
    console.log("clicked");
  };

  const logout = () => {
    setState(false);
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
            {/* <div className="other-login">
              <div className="facebook">
                <img src={facebook} alt="Facebook logo" />
                <p>Nastavi sa Facebook-om</p>
              </div>
            </div> */}
            <FacebookLogin
              appId="934444414490428"
              autoLoad={false}
              fields="name,email,picture"
              onClick={componentClicked}
              callback={responseFacebook}
            />
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
