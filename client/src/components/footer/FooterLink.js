import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FooterLink = ({ content, pageLink }) => {
  const navigate = useNavigate();

  return (
    <li>
      <a
        onClick={() => {
          navigate(`/informations?page_type=${pageLink}`);
        }}
        href="#"
      >
        {content}
      </a>
    </li>
  );
};
