import React from "react";
import Logo from "../assets/logos/Logo.svg";
import { SponsorBar } from "./SponsorBar";
import instagram from "../assets/logos/Instagram.svg";
import twitter from "../assets/logos/twitter.svg";
import facebook from "../assets/logos/facebook.svg";
import gmail from "../assets/logos/gmail.svg";
import { useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();

  if (
    location.pathname === "/qr_scanner" ||
    location.pathname === "/controller_login"
  )
    return;
  return (
    <div className="Footer">
      <div className="sponsor-scroll">
        <SponsorBar />
      </div>
      <div className="info-panel">
        <ul>
          <img src={Logo} alt="logo" />
          <p>event.ba</p>
        </ul>
        <ul>
          <li>
            <a>O nama</a>
          </li>
          <li>
            <a>Info</a>
          </li>
          <li>
            <a>FAQ</a>
          </li>
          <li>
            <a>Pomoć</a>
          </li>
        </ul>
        <ul>
          <li>
            <a>Način plaćanja</a>
          </li>
          <li>
            <a>Prodajna mjesta</a>
          </li>
          <li>
            <a>Kontakti</a>
          </li>
          <li>
            <a>Otkazani događaji</a>
          </li>
        </ul>
        <ul>
          <li>
            <a>Uvijeti korištenja</a>
          </li>
          <li>
            <a>Politika privatnosti</a>
          </li>
          <li>
            <a>Način isporuke</a>
          </li>
          <li>
            <a>NewsLetter</a>
          </li>
        </ul>
        <ul className="social-icons">
          <li>
            <a>
              <img src={instagram} alt="instagram" />
            </a>
          </li>
          <li>
            <a>
              <img src={facebook} alt="facebook" />
            </a>
          </li>
          <li>
            <a>
              <img src={twitter} alt="twitter" />
            </a>
          </li>
          <li>
            <a>
              <img src={gmail} alt="gmail" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
