import React from "react";
import { Link, useLocation } from "react-router-dom";
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

//Cards
import master from "../../assets/ikonice/mastercard.png";
import maestro from "../../assets/ikonice/maestro.png";
import visa from "../../assets/ikonice/visa.png";
import idCheck from "../../assets/ikonice/master-check.png";
import visaSecure from "../../assets/ikonice/visa-secure.png";
import monri from "../../assets/ikonice/monri_footer_negativ.png";

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
          <Link
            className="footer-logo"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            to="/"
          >
            <img src={Logo} alt="logo" />
            <p>event.ba</p>
          </Link>
        </ul>
        <ul>
          <FooterLink content="O nama" pageLink="about_us" />
          <FooterLink content="FAQ" pageLink="FAQ" />
          <FooterLink content="Pomoć" pageLink="help" />
        </ul>
        <ul>
          <FooterLink content="Način plaćanja" pageLink="payment_info" />
          <FooterLink content="Prodajna mjesta" pageLink="selling_places" />
          <FooterLink
            content="Politika privatnosti"
            pageLink="privacy_policy"
          />
        </ul>
        <ul>
          <FooterLink
            content="Uvjeti korištenja"
            pageLink="terms_of_use_buyer"
          />
          <FooterLink content="Kontakti" pageLink="contact" />
          <FooterLink content="Newsletter" pageLink="newsletter" />
        </ul>
        <ul className="social-icons">
          <FooterSocial
            socialImg={facebook}
            socialLink="https://www.facebook.com/profile.php?id=100076226389319"
            target="_blank"
          />
          {/* <FooterSocial socialImg={instagram} />
          <FooterSocial socialImg={twitter} />
          <FooterSocial socialImg={gmail} /> */}
        </ul>
      </div>
      <div className="online-payment">
        <div className="payment-wrapper">
          <div className="cards">
            <a className="card" href=" www.mastercard.com">
              <img src={master} className="master" alt="master" />
            </a>
            <a
              className="card"
              href="https://brand.mastercard.com/brandcenter/more-about-our-brands.html"
            >
              <img src={maestro} alt="maestro" />
            </a>
            <a className="card" href=" https://www.visaeurope.com">
              <img src={visa} alt="visa" />
            </a>
            <a className="card" href="">
              <img src={idCheck} alt="idCheck-MasterCard" />
            </a>
            <a className="card" href="https://www.visaeurope.com">
              <img src={visaSecure} alt="visaSecure" />
            </a>
            <a className="card" href=" https://monri.com">
              <img src={monri} alt="Monri" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
