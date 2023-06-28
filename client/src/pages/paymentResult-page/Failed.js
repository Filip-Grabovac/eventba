import React from "react";
import FailedImg from "../../assets/images/failed.svg";

export const Failed = () => {
  return (
    <div className="container failed-container">
      <img src={FailedImg} alt="Failed" />
      <h3>Došlo je do greške pri kupovini karte!</h3>
      <a href="/">Natrag na početnu</a>
    </div>
  );
};
