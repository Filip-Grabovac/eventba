import React, { useRef, useState } from "react";
import axios from "axios";
// Images
import X from "../assets/ikonice/X.svg";
import PasswordEye from "../assets/ikonice/invisible.svg";
import mail from "../assets/ikonice/mail.svg";
// Redux
import { useDispatch } from "react-redux";
import { setToken, setUserID } from "../store/userSlice";
// Components
import { Link } from "react-router-dom";
import { RegisterInput } from "./RegisterInput";
import { toast } from "react-toastify";
import FacebookLogin from "react-facebook-login";
// Functions

import { useCloseModalOnEsc } from "../functions/closeModalOnEsc";
import { useFacebookLogin } from "../functions/facebookLogin";
import { toastSetup } from "../functions/toastSetup";
import { setLoginIsOpen } from "../store/loginSlice";

export const Login = ({ setIsRegisterOpen }) => {
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordRef = useRef(null);
  const facebookLogin = useFacebookLogin(setUserID);
  const [forgotPasswordFields, isForgotPasswordVisible] = useState(false);
  const [rememberMe, setRememberStatus] = useState(false);

  // Around modal click exit login
  const handleModalClick = (e) => {
    if (e.target.classList.contains("login-screen"))
      dispatch(setLoginIsOpen(false));
  };

  // Press escape key exit login

  useCloseModalOnEsc();

  // Login user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/login`,
        { password: e.target.elements.password.value, email }
      );

      const { id, is_banned, token } = response.data;

      if (is_banned) {
        toast.error(
          `Ovom korisniku je zabranjen pristup platformi!`,
          toastSetup("top-center", 3000)
        );
        return;
      }

      if (rememberMe) {
        localStorage.setItem("token", token); // Save the token in local storage
        localStorage.setItem("userId", id); // Save in local storage
      } else {
        sessionStorage.setItem("token", token); // Save the token in session storage
        sessionStorage.setItem("userId", id); // Save in session storage
      }

      dispatch(setUserID(id));
      dispatch(setToken(token));
      dispatch(setLoginIsOpen(false));

      toast.success("Uspješna prijava!", toastSetup("top-center", 3000));
    } catch (error) {
      toast.error(error.response.data.message, toastSetup("top-center", 3000));
      passwordRef.current.focus();
    }
  };

  // Close login and open register
  const handleOpenRegister = (e) => {
    e.preventDefault();

    dispatch(setLoginIsOpen(false));
    setIsRegisterOpen(true);
  };

  function forgotPassword(e) {
    e.preventDefault();

    isForgotPasswordVisible(!forgotPasswordFields);
  }

  async function forgotPasswordSubmit(e) {
    e.preventDefault();
    const email = new FormData(e.target).get("email");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/helper/request_password`,
        {
          email,
        }
      );

      toast.success(response.data, toastSetup("top-center", 3000));
    } catch (error) {
      toast.error(error.response.data, toastSetup("top-center", 3000));
      console.error("Error posting data:", error);
    }
  }

  return (
    <div className="login-box">
      <div className="login-screen" onClick={handleModalClick}>
        <div className="container">
          <button
            className="close-btn"
            onClick={() => {
              dispatch(setLoginIsOpen(false));
            }}
          >
            <img src={X} alt="" />
          </button>
          <h2>{!forgotPasswordFields ? "Prijava" : "Nova lozinka"}</h2>
          <div className="text-section">
            <form
              onSubmit={(e) => {
                !forgotPasswordFields
                  ? handleSubmit(e)
                  : forgotPasswordSubmit(e);
              }}
            >
              <RegisterInput
                placeholder="Email"
                type="email"
                icon={mail}
                name="email"
                isRequired={true}
              />
              {!forgotPasswordFields ? (
                <>
                  <RegisterInput
                    ref={passwordRef}
                    placeholder="Lozinka"
                    type="password"
                    icon={PasswordEye}
                    name="password"
                    cursorPointer={true}
                    isPasswordVisible={isPasswordVisible}
                    setIsPasswordVisible={setIsPasswordVisible}
                  />
                  <div className="login-btns-wrapper">
                    <button type="submit" className="login-btn">
                      Prijavi se!
                    </button>
                    {/* <FacebookLogin
                      textButton="Prijavi se s Facebook-om"
                      appId="934444414490428"
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={(fbResponse) => {
                        facebookLogin(fbResponse);
                      }}
                    /> */}
                  </div>
                </>
              ) : (
                <button className="login-btn" type="submit">
                  Pošalji mail
                </button>
              )}
              <div className="login-remember-wrapper">
                <a
                  onClick={(e) => {
                    forgotPassword(e);
                  }}
                  className="forgot-password"
                  href="#"
                >
                  {!forgotPasswordFields
                    ? "Zaboravili ste lozinku?"
                    : "Natrag na prijavu"}
                </a>
                {!forgotPasswordFields ? (
                  <p className="remember-me">
                    Zapamti me{" "}
                    <input
                      onChange={() => {
                        setRememberStatus(!rememberMe);
                      }}
                      type="checkbox"
                    />
                  </p>
                ) : (
                  ""
                )}
              </div>
              <p>
                Nemaš event.ba račun?
                <br />
                <Link onClick={handleOpenRegister}>Registriraj</Link> se!
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
