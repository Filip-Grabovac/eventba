import React from "react";
import FailedImg from "../../assets/images/failed.svg";
import { Link } from "react-router-dom";

export const Failed = () => {
  return (
    <div className="container failed-container">
      <img src={FailedImg} alt="Failed" />
      <h3>Došlo je do greške pri kupovini karte!</h3>
      <Link to="/">Natrag na početnu</Link>
    </div>
  );
};
