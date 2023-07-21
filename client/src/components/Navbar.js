import React, { useEffect, useState } from "react";
// Images
import Logo from "../assets/logo/logo.svg";
import UserIcon from "../assets/ikonice/user_icon.svg";
import Menu from "../assets/ikonice/menu.svg";
// Components
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Login } from "../auth/Login";
import { Register } from "../auth/Register";
import { toast } from "react-toastify";
import { toastSetup } from "../functions/toastSetup";
// Other
import { useSelector, useDispatch } from "react-redux";
import { setUserID } from "../store/userSlice";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const userId = useSelector((state) => state.userState.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Logout function
  const logout = () => {
    dispatch(setUserID(""));
    localStorage.clear();
    navigate("/");
    toast.success("Uspješna odjava", toastSetup("top-right", 2000));
  };

  //Pop login window if not logged in.
  useEffect(() => {
    setIsDropdownOpen(false);
    // Check if the route navigation state has "openLogin" property and its value is true
    if (
      (location.pathname === "/buy" || location.pathname === "/profile") &&
      userId === ""
    ) {
      setIsLoginOpen(true);
    }
  }, [location]);

  //Hide sticky navbar functinality for /qr_scanner and /controller_login
  useEffect(() => {
    const el = document.querySelector(".nav-wrapper");

    if (
      location.pathname === "/qr_scanner" ||
      location.pathname === "/controller_login"
    )
      return;

    // Sticky navbar functionality
    function handleIntersection(entries) {
      if (entries[0].isIntersecting) {
        document.querySelector(".navbar").classList.remove("sticky-nav");
      } else {
        document.querySelector(".navbar").classList.add("sticky-nav");
      }
    }

    const observer = new IntersectionObserver(handleIntersection);
    observer.observe(el);
  }, []);

  // Disable scroll when modal windows opened
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if login or register modal window opened
    setTimeout(() => {
      if (isLoginOpen || isRegisterOpen) {
        document.body.style.overflow = "hidden";
        if (document.querySelector(".sticky-nav"))
          document.querySelector(".sticky-nav").style =
            "backdrop-filter: none !important";
      } else {
        document.body.style.overflow = "unset";
        if (document.querySelector(".sticky-nav"))
          document.querySelector(".sticky-nav").style =
            "backdrop-filter: blur(20px)";
      }
    }, 150);
  }, [isLoginOpen, isRegisterOpen]);

  // Hide navbar for /qr_scanner and /controller_login
  if (
    location.pathname === "/qr_scanner" ||
    location.pathname === "/controller_login"
  )
    return;

  return (
    <div className="nav-wrapper">
      <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar">
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
            <ul className="navbar-nav">
              <div className="navbar-middle-part">
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/"
                  >
                    Naslovna
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/"
                  >
                    Koncerti
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="#"
                  >
                    Sport
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="#"
                  >
                    Festivali
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="#"
                  >
                    Izvođači
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="#"
                  >
                    Kontakt
                  </NavLink>
                </li>
              </div>
              <li className="nav-item profile-link">
                <button
                  className="nav-link active user-icon-link"
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  <img src={UserIcon} alt="User Icon" />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown">
                    <ul>
                      {!userId && (
                        <li>
                          <button
                            onClick={() => {
                              setIsLoginOpen(!isLoginOpen);
                            }}
                          >
                            Prijava
                          </button>
                        </li>
                      )}
                      {!userId && (
                        <li>
                          <button
                            onClick={() => {
                              setIsRegisterOpen(!isRegisterOpen);
                            }}
                          >
                            Registriraj se
                          </button>
                        </li>
                      )}
                      {userId && (
                        <li>
                          <Link to={"/profile"}>
                            <span>Profil</span>
                          </Link>
                        </li>
                      )}
                      {userId && (
                        <li>
                          <button onClick={logout}>Odjavi se</button>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
        {isLoginOpen && (
          <Login
            isLoginOpen={isLoginOpen}
            setIsLoginOpen={setIsLoginOpen}
            setIsRegisterOpen={setIsRegisterOpen}
          />
        )}
        {isRegisterOpen && (
          <Register
            isRegisterOpen={isRegisterOpen}
            setIsRegisterOpen={setIsRegisterOpen}
            setIsLoginOpen={setIsLoginOpen}
          ></Register>
        )}
      </nav>
    </div>
  );
};
