import React, { useState } from "react";
import Logo from "../assets/logo/logo.svg";
import UserIcon from "../assets/ikonice/user_icon.svg";
import SearchInput from "../pages/landing/hero/mainSearch/SearchInput";
import { Link, NavLink } from "react-router-dom";
import { Login } from "../auth/Login";
import { Register } from "../auth/Register";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={Logo} alt="Logo" />
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
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <div className="navbar-middle-part">
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="/">
                  Koncerti
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="#">
                  Sport
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="#">
                  Festivali
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="#">
                  Izvođači
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active" aria-current="page" to="#">
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
                    <li>
                      <button
                        onClick={() => {
                          setIsLoginOpen(!isLoginOpen);
                        }}
                      >
                        Login
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsRegisterOpen(!isRegisterOpen);
                        }}
                      >
                        Register
                      </button>
                    </li>
                    <li>
                      <Link to={"/profile"}>Profile</Link>
                    </li>
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
        <Login isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
      )}
      {isRegisterOpen && (
        <Register
          isRegisterOpen={isRegisterOpen}
          setIsRegisterOpen={setIsRegisterOpen}
        ></Register>
      )}
    </nav>
  );
};
