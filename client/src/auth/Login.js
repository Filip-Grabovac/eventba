import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RegisterInput } from "./RegisterInput";
import X from "../assets/ikonice/X.svg";

import PasswordEye from "../assets/ikonice/invisible.svg";
import mail from "../assets/ikonice/mail.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { Decrypt } from "./Decrypt";
import FacebookLogin from "react-facebook-login";
// REDUX
import { useDispatch } from "react-redux";
import { setUserID } from "../store/userSlice";

export const Login = ({ isLoginOpen, setIsLoginOpen, setIsRegisterOpen }) => {
  const toastSetup = {
    position: "top-right",
    autoClose: 3000,
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
  const passwordRef = useRef(null);
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
        dispatch(setUserID(id));
        localStorage.setItem("userId", id);
        toast.success("Uspješna prijava!", toastSetup);
        setIsLoginOpen(false);
      } else {
        toast.error(`Lozinka nije ispravna!`, toastSetup);
        passwordRef.current.focus();
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
  const responseFacebook = async (fbResponse) => {
    if (fbResponse.accessToken) {
      const fbUserEmail = fbResponse.email;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/fbEmail/${fbUserEmail}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { id } = response.data;
        dispatch(setUserID(id));
        localStorage.setItem("userId", id);
      } catch (error) {
        const user = {
          name: fbResponse.name.split(" ")[0],
          lname:
            fbResponse.name.split(" ")[fbResponse.name.split(" ").length - 1],
          email: fbResponse.email,
          fbEmail: fbResponse.email,
          profileImg: fbResponse.picture.data.url,
          role: "standard",
        };

        await axios
          .post(process.env.REACT_APP_API_URL + "/api/v1/users", user, {
            headers: {
              "Content-Type": "application/json",
            },
          })

          .then((response) => {
            dispatch(setUserID(response.data.user._id));
            localStorage.setItem("userId", response.data.user._id);
            setIsLoginOpen(false);
          })

          .catch((error) => {
            // Handle any errors
            console.error("Error:");
            toast.error(
              `Došlo je do pogreške prilikom registracije. ${error.response.data.error}!`,
              toastSetup
            );
          });
      }
      setIsLoginOpen(false);
      toast.success("Uspješna prijava!", toastSetup);
    }
  };

  const handleOpenRegister = (e) => {
    e.preventDefault();
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
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
            {/* <div className="other-login">
                <div className="facebook">
                  <img src={facebook} alt="Facebook logo" />
                  <p>Nastavi sa Facebook-om</p>
                </div>
              </div> */}
            <FacebookLogin
              textButton="Prijavi se s Facebook-om"
              appId="934444414490428"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
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
