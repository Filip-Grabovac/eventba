import React from 'react';

export const FooterSocial = ({ socialImg, socialLink }) => {
  return (
    <li>
      <a href={socialLink}>
        <img src={socialImg} alt="instagram" />
      </a>
    </li>
  );
};
