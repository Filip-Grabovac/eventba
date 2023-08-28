import React from 'react';
import { useLocation } from 'react-router-dom';
import { AboutUs } from './separate-info-pages/AboutUs';
import { Info } from './separate-info-pages/Informations';
import { FAQ } from './separate-info-pages/FAQ';
import { Help } from './separate-info-pages/Help';
import { PaymentInfo } from './separate-info-pages/PaymentInfo';
import { PrivacyPolicy } from './separate-info-pages/PrivacyPolicy';
import { TermsOfUseBuyer } from './separate-info-pages/TermsOfUseBuyer';
import { Contact } from './separate-info-pages/Contact';
import { TermsOfUseOrganizer } from './separate-info-pages/TermsOfUseOrganizer';
import { SellingPlaces } from './separate-info-pages/SellingPlaces';
import { NewsLetter } from './separate-info-pages/NewsLetter';

export const OverallInfo = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageType = queryParams.get('page_type');

  return (
    <div>
      {pageType === 'about_us' ? (
        <AboutUs heading="O nama" />
      ) : pageType === 'info' ? (
        <Info heading="Info" />
      ) : pageType === 'FAQ' ? (
        <FAQ heading="FAQ" />
      ) : pageType === 'help' ? (
        <Help heading="Pomoć" />
      ) : pageType === 'payment_info' ? (
        <PaymentInfo heading="Način plaćanja" />
      ) : pageType === 'privacy_policy' ? (
        <PrivacyPolicy heading="Politika privatnosti" />
      ) : pageType === 'terms_of_use_buyer' ? (
        <TermsOfUseBuyer heading="Uvjeti korištenja za kupca" />
      ) : pageType === 'contact' ? (
        <Contact heading="Kontakt" />
      ) : pageType === 'terms_of_use_organizer' ? (
        <TermsOfUseOrganizer heading="Uvjeti korištenja za organizatora" />
      ) : pageType === 'selling_places' ? (
        <SellingPlaces heading="Prodajna mjesta" />
      ) : pageType === 'newsletter' ? (
        <NewsLetter heading="NewsLetter" />
      ) : (
        ''
      )}
    </div>
  );
};
