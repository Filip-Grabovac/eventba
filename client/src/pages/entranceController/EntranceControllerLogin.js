import React, { useEffect, useState } from "react";
import UserIcon from "../../assets/ikonice/user_icon.svg";
import PasswordEye from "../../assets/ikonice/invisible.svg";
import { RegisterInput } from "../../auth/RegisterInput";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserID } from "../../store/entranceControllerSlice";
import { useNavigate } from "react-router-dom";

export const EntranceControllerLogin = () => {
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  let controllerLocalStorage = localStorage.getItem("entranceControllerId");
  const entranceControllerId = useSelector(
    (state) => state.entranceControllerState.entranceController
  );
  const navigate = useNavigate();

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

  useEffect(() => {
    document.querySelector(".App").style = "min-height: 100vh";

    if (controllerLocalStorage) {
      dispatch(setUserID(controllerLocalStorage));
    }

    if (entranceControllerId) {
      navigate("/qr_scanner");
    }
  });

  async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/v1/entrance_controllers/username",
        {
          name: username,
          password: password,
        }
      );

      toast.success(response.data.message, toastSetup);
      dispatch(setUserID(response.data.id));
      localStorage.setItem("entranceControllerId", response.data.id);
    } catch (error) {
      toast.warn(error.response.data.message, toastSetup);
    }
  }

  return (
    <div className="entrance-controller-login-section">
      <div className="login-screen">
        <div className="container">
          <h2>Prijava kontrolora ulaza</h2>
          <div className="text-section">
            <form
              onSubmit={(e) => {
                handleFormSubmit(e);
              }}
            >
              <RegisterInput
                placeholder="Korisničko ime"
                type="text"
                icon={UserIcon}
                name="username"
                isRequired={true}
              />
              <RegisterInput
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
              <button type="submit" className="login-btn">
                Prijavi se!
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
