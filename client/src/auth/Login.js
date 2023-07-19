import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
// Images
import X from "../assets/ikonice/X.svg";
import PasswordEye from "../assets/ikonice/invisible.svg";
import mail from "../assets/ikonice/mail.svg";
// Redux
import { useDispatch } from "react-redux";
import { setUserID } from "../store/userSlice";
// Components
import { Link } from "react-router-dom";
import { RegisterInput } from "./RegisterInput";
import { toast } from "react-toastify";
import FacebookLogin from "react-facebook-login";
// Functions
import { Decrypt } from "./Decrypt";
import { closeModalOnEsc } from "../functions/closeModalOnEsc";
import { useFacebookLogin } from "../functions/facebookLogin";
import { toastSetup } from "../functions/toastSetup";

export const Login = ({ isLoginOpen, setIsLoginOpen, setIsRegisterOpen }) => {
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordRef = useRef(null);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const facebookLogin = useFacebookLogin(setIsLoginOpen, setUserID);

  // Around modal click exit login
  const handleModalClick = (e) => {
    if (e.target.classList.contains("login-screen")) setIsLoginOpen(false);
  };

  // Press escape key exit login
  useEffect(() => {
    closeModalOnEsc(setIsLoginOpen);
  }, [setIsLoginOpen]);

  // Login user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;

    // Get user from database
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

      // Decrypt and check user passwor vs password input
      if (
        Decrypt(userPassword, secretKey) === e.target.elements.password.value
      ) {
        dispatch(setUserID(id));
        localStorage.setItem("userId", id);
        setIsLoginOpen(false);

        toast.success("Uspješna prijava!", toastSetup("top-center", 3000));
      } else {
        toast.error(`Lozinka nije ispravna!`, toastSetup("top-center", 3000));
        passwordRef.current.focus();
      }
    } catch (error) {
      toast.error(
        `Došlo je do pogreške prilikom prijave. ${error.response.data.error}!`,
        toastSetup("top-center", 3000)
      );
    }
  };

  // Close login and open register
  const handleOpenRegister = (e) => {
    e.preventDefault();
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
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
              ref={passwordRef}
              placeholder="Lozinka"
              type="password"
              icon={PasswordEye}
              name="password"
              isRequired={true}
              inputLength={6}
              cursorPointer={true}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
            <FacebookLogin
              textButton="Prijavi se s Facebook-om"
              appId="934444414490428"
              autoLoad={false}
              fields="name,email,picture"
              callback={(fbResponse) => {
                facebookLogin(fbResponse);
              }}
            />
            <p>
              Nemaš event.ba račun?{" "}
              <Link onClick={handleOpenRegister}>Registriraj</Link> se!
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
