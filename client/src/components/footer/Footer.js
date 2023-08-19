import React from 'react';
import { Link, useLocation } from 'react-router-dom';
//Images
import Logo from '../../assets/logos/Logo.svg';
import instagram from '../../assets/logos/Instagram.svg';
import twitter from '../../assets/logos/twitter.svg';
import facebook from '../../assets/logos/facebook.svg';
import gmail from '../../assets/logos/gmail.svg';
//Components
import { SponsorBar } from '../SponsorBar';
import { FooterLink } from './FooterLink';
import { FooterSocial } from './FooterSocial';

export const Footer = () => {
  const location = useLocation();

  // Hide footer for /qr_scanner and /controller_login
  if (
    location.pathname === '/qr_scanner' ||
    location.pathname === '/controller_login'
  )
    return;
  return (
    <div className="Footer">
      <div className="sponsor-scroll">
        <SponsorBar />
      </div>
      <div className="info-panel">
        <ul>
          <Link className="footer-logo" to="/">
            <img src={Logo} alt="logo" />
            <p>event.ba</p>
          </Link>
        </ul>
        <ul>
          <FooterLink content="O nama" pageLink="about_us" />
          <FooterLink content="Info" pageLink="info" />
          <FooterLink content="FAQ" pageLink="faq" />
          <FooterLink content="Pomoć" pageLink="help" />
        </ul>
        <ul>
          <FooterLink content="Način plaćanja" pageLink="payment_info" />
          <FooterLink content="Prodajna mjesta" pageLink="selling_places" />
          <FooterLink content="Kontakti" pageLink="contact" />
          <FooterLink content="Otkazani događaji" pageLink="cancelled_events" />
        </ul>
        <ul>
          <FooterLink content="Uvjeti korištenja" pageLink="terms_of_use" />
          <FooterLink
            content="Politika privatnosti"
            pageLink="privacy_policy"
          />
          <FooterLink content="Način isporuke" pageLink="delivery_method" />
          <FooterLink content="NewsLetter" pageLink="newsletter" />
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
    </div>
  );
};
