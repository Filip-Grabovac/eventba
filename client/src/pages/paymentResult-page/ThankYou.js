import React from "react";
import ThankYouImg from "../../assets/images/thank_you.svg";
import { Link } from "react-router-dom";

export const ThankYou = () => {
  return (
    <div className="container thank-you-container">
      <img src={ThankYouImg} alt="Thank You" />
      <h3>Uspješno ste kupili ulaznicu! Ulaznice se poslane na mail.</h3>
      <Link to="/">Natrag na početnu</Link>
    </div>
  );
};
