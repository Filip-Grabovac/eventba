import React from "react";
import Logo from "../assets/logo/logo.svg";
import UserIcon from "../assets/ikonice/user_icon.svg";
import SearchInput from "../pages/landing/hero/mainSearch/SearchInput";
import { Link } from "react-router-dom";

export const Navbar = () => {
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
                <a className="nav-link active" aria-current="page" href="#">
                  Koncerti
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Sport
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Festivali
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Izvođači
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Kontakt
                </a>
              </li>
            </div>
            <li className="nav-item">
              <a
                className="nav-link active user-icon-link"
                aria-current="page"
                href="#"
              >
                <img src={UserIcon} alt="User Icon" />
              </a>
            </li>
            <li className="nav-item input-nav-link">
              <SearchInput />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
