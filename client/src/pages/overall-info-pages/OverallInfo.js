import React from 'react';
import { useLocation } from 'react-router-dom';
import { AboutUs } from './separate-info-pages/AboutUs';
import { Info } from './separate-info-pages/Informations';

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
      ) : (
        ''
      )}
    </div>
  );
};
