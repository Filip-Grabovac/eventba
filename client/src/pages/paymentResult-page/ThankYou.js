import React from "react";
import ThankYouImg from "../../assets/images/thank_you.svg";
import { Link, useNavigate } from "react-router-dom";

export const ThankYou = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/");
  }, 3000);
  return (
    <div className="container thank-you-container">
      <img src={ThankYouImg} alt="Thank You" />
      <h3>
        Uspješno ste obavili kupovinu! Ulaznice su procesu izrade i slanja na
        mail.
      </h3>
      <Link to="/">Natrag na početnu</Link>
    </div>
  );
};
