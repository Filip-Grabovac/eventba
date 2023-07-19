import React, { useEffect, useState } from "react";
import UserIcon from "../../assets/ikonice/user_icon.svg";
import PasswordEye from "../../assets/ikonice/invisible.svg";
import { RegisterInput } from "../../auth/RegisterInput";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserID } from "../../store/entranceControllerSlice";
import { useNavigate } from "react-router-dom";
import { toastSetup } from "../../functions/toastSetup";

export const EntranceControllerLogin = () => {
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  let controllerLocalStorage = localStorage.getItem("entranceControllerId");
  let dbLocalStorage = localStorage.getItem("dbId");
  const entranceControllerId = useSelector(
    (state) => state.entranceControllerState.entranceController.controllerId
  );
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector(".App").style = "min-height: 100vh";

    if (controllerLocalStorage) {
      dispatch(
        setUserID({
          controllerId: controllerLocalStorage,
          dbId: dbLocalStorage,
        })
      );
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

      toast.success(response.data.message, toastSetup("top-right", 3000));
      dispatch(
        setUserID({
          controllerId: response.data.id,
          dbId: response.data.collectionName,
        })
      );
      localStorage.setItem("entranceControllerId", response.data.id);
      localStorage.setItem("dbId", response.data.collectionName);
    } catch (error) {
      toast.warn(error.response.data.message, toastSetup("top-right", 3000));
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
