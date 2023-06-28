import React from "react";
import ThankYouImg from "../../assets/images/thank_you.svg";

export const ThankYou = () => {
  return (
    <div className="container thank-you-container">
      <img src={ThankYouImg} alt="Thank You" />
      <h3>Uspješno ste kupili kartu!</h3>
      <a href="/">Natrag na početnu</a>
    </div>
  );
};
