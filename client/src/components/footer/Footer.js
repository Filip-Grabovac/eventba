import React from "react";
import { useLocation } from "react-router-dom";
//Images
import Logo from "../../assets/logos/Logo.svg";
import instagram from "../../assets/logos/Instagram.svg";
import twitter from "../../assets/logos/twitter.svg";
import facebook from "../../assets/logos/facebook.svg";
import gmail from "../../assets/logos/gmail.svg";
//Components
import { SponsorBar } from "../SponsorBar";
import { FooterLink } from "./FooterLink";
import { FooterSocial } from "./FooterSocial";

export const Footer = () => {
  const location = useLocation();

  // Hide footer for /qr_scanner and /controller_login
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
          <FooterLink content="O nama" />
          <FooterLink content="Info" />
          <FooterLink content="FAQ" />
          <FooterLink content="Pomoć" />
        </ul>
        <ul>
          <FooterLink content="Način plaćanja" />
          <FooterLink content="Prodajna mjesta" />
          <FooterLink content="Kontakti" />
          <FooterLink content="Otkazani događaji" />
        </ul>
        <ul>
          <FooterLink content="Uvijeti korištenja" />
          <FooterLink content="Politika privatnosti" />
          <FooterLink content="Način isporuke" />
          <FooterLink content="NewsLetter" />
        </ul>
        <ul className="social-icons">
          <FooterSocial socialImg={instagram} />
          <FooterSocial socialImg={facebook} />
          <FooterSocial socialImg={twitter} />
          <FooterSocial socialImg={gmail} />
        </ul>
      </div>
    </div>
  );
};
