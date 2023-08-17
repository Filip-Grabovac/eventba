import React from 'react';
import ErrorImg from '../assets/images/404_error.png';

export const ErrorPage = () => {
  return (
    <div className="error-page">
      <img src={ErrorImg} alt="Greska" />
      <h5>Ne postoji stranica na ovom linku!</h5>
    </div>
  );
};
