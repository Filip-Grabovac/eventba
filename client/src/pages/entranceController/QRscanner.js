import React from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/logo.svg";
import { useDispatch } from "react-redux";
import { setUserID } from "../../store/entranceControllerSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../../assets/ikonice/logout_btn.svg";
import axios from "axios";

export const QRscanner = () => {
  const [isSuccess, setState] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let dbLocalStorage = localStorage.getItem("dbId");

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
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    // Successfull scan
    async function success(ticketId) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL +
            `/api/v1/tickets/${dbLocalStorage}/${ticketId}`
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

    function error(err) {
      console.warn(err);
    }
  }, []);

  function logout() {
    dispatch(setUserID(""));
    localStorage.setItem("entranceControllerId", "");
    localStorage.setItem("dbId", "");
    navigate("/controller_login");
    toast.success("Uspješna odjava", toastSetup);
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">
            <img src={Logo} alt="Logo" />
            <p>event.ba</p>
          </Link>
        </div>
        <button className="controller-logout-btn" onClick={logout}>
          Odjavi se
          <img src={LogoutIcon} alt="Logout" />
        </button>
      </nav>
      <div id="reader"></div>
      <div></div>
    </div>
  );
};
