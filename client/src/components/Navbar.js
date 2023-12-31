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
import { setToken, setUserID } from "../store/userSlice";
import { setLoginIsOpen } from "../store/loginSlice";

export const Navbar = () => {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const userId = useSelector((state) => state.userState.user);
  const token = useSelector((state) => state.userState.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginOpen = useSelector((state) => state.loginState.isLoginOpen);

  // Logout function
  const logout = () => {
    setIsDropdownOpen(false);
    dispatch(setUserID(""));
    dispatch(setToken(""));
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
    toast.success("Uspješna odjava", toastSetup("top-right", 2000));
  };

  //Pop login window if not logged in.
  useEffect(() => {
    setIsDropdownOpen(false);
    // Check if the route navigation state has "openLogin" property and its value is true
    if (location.pathname === "/profile" && userId === "" && token === "") {
      dispatch(setLoginIsOpen(true));
    }
  }, [location]);

  function handleScroll() {
    setIsNavbarCollapsed(true);
  }
  //Hide sticky navbar functinality for /qr_scanner and /controller_login
  useEffect(() => {
    const el = document.querySelector(".nav-wrapper");

    if (
      location.pathname === "/qr_scanner" ||
      location.pathname === "/controller_login"
    )
      return;

    // Sticky navbar functionality
    let lastIntersecting = true;

    function handleIntersection(entries) {
      const isIntersecting = entries[0].isIntersecting;
      if (isIntersecting && !lastIntersecting) {
        document.querySelector(".navbar").classList.remove("sticky-nav");
        setIsNavbarCollapsed(true);
        setIsDropdownOpen(false); // Ensure dropdown is closed when the navbar collapses
      } else if (!isIntersecting && lastIntersecting) {
        document.querySelector(".navbar").classList.add("sticky-nav");
      }
      lastIntersecting = isIntersecting;
    }

    const observer = new IntersectionObserver(handleIntersection);
    observer.observe(el);

    // Scroll event listener to collapse navbar on scroll
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
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

  const isActive = (path) => {
    const typeParam = new URLSearchParams(location.search).get("type");
    // Check if the current location matches the given path
    return typeParam === path;
  };

  // Hide navbar for /qr_scanner and /controller_login
  if (
    location.pathname === "/qr_scanner" ||
    location.pathname === "/controller_login"
  )
    return;

  return (
    <header className="nav-wrapper">
      <nav className="navbar navbar-expand-xl custom-navbar">
        <div className="container-fluid">
          <Link
            className="navbar-brand"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            to="/"
          >
            <img src={Logo} alt="Logo" />
            <h1 style={{ fontSize: "22px", color: "white", margin: "0" }}>
              event.ba
            </h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded={!isNavbarCollapsed} // Toggle the aria-expanded attribute based on the state
            aria-label="Toggle navigation"
            onClick={() => setIsNavbarCollapsed((prevState) => !prevState)} // Toggle the state on click
          >
            <img src={Menu} className="navbar-toggler-icon" alt="Menu" />
          </button>
          <div
            className={`collapse navbar-collapse ${
              isNavbarCollapsed ? "" : "show"
            }`}
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav">
              <div className="navbar-middle-part">
                <li className="nav-item">
                  <NavLink
                    className={`nav-link ${
                      location.pathname === "/" ? "navlink-active" : ""
                    }`}
                    aria-current="page"
                    to="/"
                    onClick={() => {
                      if (!isNavbarCollapsed) {
                        setIsNavbarCollapsed(true);
                      }
                    }}
                  >
                    Naslovna
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={`nav-link ${
                      isActive("concert") ? "navlink-active" : ""
                    }`}
                    to="/list_page?type=concert"
                  >
                    Koncerti
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={`nav-link ${
                      isActive("festival") ? "navlink-active" : ""
                    }`}
                    aria-current="page"
                    to="/list_page?type=festival"
                  >
                    Festivali
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={`nav-link ${
                      isActive("sport") ? "navlink-active" : ""
                    }`}
                    to="/list_page?type=sport"
                  >
                    Sport
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={`nav-link ${
                      isActive("theaters") ? "navlink-active" : ""
                    }`}
                    to="/list_page?type=theaters"
                  >
                    Predstave
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className={`nav-link ${
                      isActive("other") ? "navlink-active" : ""
                    }`}
                    to="/list_page?type=other"
                  >
                    Ostalo
                  </NavLink>
                </li>
                {/* <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="#">
                    Izvođači
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="#">
                    Kontakt
                  </NavLink>
                </li> */}
              </div>
              <li className="nav-item profile-link">
                <button
                  className="nav-link user-icon-link"
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  <img src={UserIcon} alt="User Icon" />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown">
                    <ul>
                      {!token && (
                        <li>
                          <button
                            onClick={() => {
                              dispatch(setLoginIsOpen(true));
                              setIsDropdownOpen(false);
                            }}
                          >
                            Prijava
                          </button>
                        </li>
                      )}
                      {!token && (
                        <li>
                          <button
                            onClick={() => {
                              setIsRegisterOpen(!isRegisterOpen);
                              setIsDropdownOpen(false);
                            }}
                          >
                            Registriraj se
                          </button>
                        </li>
                      )}
                      {userId && token && (
                        <li>
                          <Link
                            to={"/profile"}
                            onClick={() => {
                              if (!isNavbarCollapsed) {
                                setIsNavbarCollapsed(true);
                              }
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span>Profil</span>
                          </Link>
                        </li>
                      )}
                      {userId && token && (
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
        {isLoginOpen && <Login setIsRegisterOpen={setIsRegisterOpen} />}
        {isRegisterOpen && (
          <Register
            isRegisterOpen={isRegisterOpen}
            setIsRegisterOpen={setIsRegisterOpen}
          ></Register>
        )}
      </nav>
    </header>
  );
};
