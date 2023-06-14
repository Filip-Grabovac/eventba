import React from "react";
import Logo from "../assets/logo/logo.svg";
import UserIcon from "../assets/ikonice/user_icon.svg";
import SearchIcon from "../assets/ikonice/search_icon.png";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src={Logo} alt="Logo" />
        </a>
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
              <div className="nav-search-wrapper">
                <input type="text" placeholder="Pretražite..." />
                <img src={SearchIcon} alt="Search Icon" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
