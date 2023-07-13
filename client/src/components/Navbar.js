import React, { useEffect, useState } from "react";
import Logo from "../assets/logo/logo.svg";
import UserIcon from "../assets/ikonice/user_icon.svg";
import Menu from "../assets/ikonice/menu.svg";
import SearchInput from "../pages/landing/hero/mainSearch/SearchInput";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Login } from "../auth/Login";
import { Register } from "../auth/Register";
import { useSelector, useDispatch } from "react-redux";
import { setUserID } from "../store/userSlice";
import { toast } from "react-toastify";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const userId = useSelector((state) => state.userState.user);

  const toastSetup = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(setUserID(""));
    localStorage.clear();
    navigate("/");
    toast.success("Uspješna odjava", toastSetup);
  };
  const location = useLocation();

  //Pop login window if not logged in.
  useEffect(() => {
    setIsDropdownOpen(false);
    // Check if the route navigation state has "openLogin" property and its value is true
    if (location.pathname === "/buy" && userId === "") {
      setIsLoginOpen(true);
    }
  }, [location]);

  useEffect(() => {
    // Sticky navbar
    const el = document.querySelector(".nav-wrapper");

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
            {/* <span className="navbar-toggler-icon"></span> */}
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
              <li className="nav-item input-nav-link">
                <SearchInput />
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
