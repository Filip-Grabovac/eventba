import React from 'react';

export const FooterSocial = ({ socialImg, socialLink, target }) => {
  return (
    <li>
      <a target={target} href={socialLink}>
        <img src={socialImg} alt="instagram" />
      </a>
    </li>
  );
};
