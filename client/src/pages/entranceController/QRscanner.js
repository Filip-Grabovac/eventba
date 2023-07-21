import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
// Images
import Logo from "../../assets/logo/logo.svg";
import LogoutIcon from "../../assets/ikonice/logout_btn.svg";
import Menu from "../../assets/ikonice/menu.svg";
// Components
import { Html5QrcodeScanner } from "html5-qrcode";
import { Link } from "react-router-dom";
import { toastSetup } from "../../functions/toastSetup";
import { toast } from "react-toastify";
// Redux
import { useDispatch } from "react-redux";
import { setUserID } from "../../store/entranceControllerSlice";
import { useNavigate } from "react-router-dom";

export const QRscanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let dbLocalStorage = localStorage.getItem("dbId");
  const [ticketState, setState] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [scanningProcess, setScanningProcess] = useState("done");

  // Scanner setup
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
      setScanningProcess("scanning");

      // Try to find ticket with id and event name, display "Uspjesno"
      try {
        const response = await axios.patch(
          process.env.REACT_APP_API_URL +
            `/api/v1/tickets/${dbLocalStorage}/${ticketId}`
        );

        setState(response.data.msg);
        setTimeout(() => {
          setState();
          setErrorMsg();
        }, 1500);
        setScanningProcess("done");

        // Dispay "Neuspjesno"
      } catch (error) {
        setErrorMsg(error.response.data.msgInfo);
        setState(error.response.data.msg);
        setTimeout(() => {
          setState();
          setErrorMsg();
        }, 1500);
        setScanningProcess("done");
      }
    }

    function error(err) {
      console.warn(err);
    }
  }, []);

  // Logout from QR scanner
  function logout() {
    dispatch(setUserID(""));
    localStorage.setItem("entranceControllerId", "");
    localStorage.setItem("dbId", "");
    navigate("/controller_login");
    toast.success("Uspješna odjava", toastSetup("top-right", 2000));
  }

  return (
    <div className="qr-scanner-container">
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={Logo} alt="Logo" />
            <p>event.ba</p>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <img src={Menu} className="navbar-toggler-icon" alt="Menu" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav qr-sacnner-nav">
              <li className="nav-item">
                <button className="controller-logout-btn" onClick={logout}>
                  Odjavi se
                  <img src={LogoutIcon} alt="Logout" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div id="reader"></div>
      <div
        className={`qr-message ${
          ticketState === "Uspješno"
            ? "success-scan"
            : ticketState === "Neuspješno"
            ? "failed-scan"
            : "scan-in-process"
        }`}
      >
        <p>
          {ticketState !== "Uspješno" && ticketState !== "Neuspješno"
            ? "Skeniraj"
            : ticketState}
        </p>
        {scanningProcess === "scanning" ? <span className="loader"></span> : ""}
        <span>{errorMsg ? errorMsg : ""}</span>
      </div>
    </div>
  );
};
