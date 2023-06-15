import React from "react";
import PosterImg from "../../../assets/images/test2.png";

export const SecondaryCard = () => {
  return (
    <div className="secondary-card-single">
      <img src={PosterImg} alt="Poster img" />
      <div>
        <h3>Matija Cvek</h3>
        <p>Bitefartcafe, Beograd</p>
      </div>
      <p className="single-date">07.jun.2023 22:00 </p>
      <a href="#">Kupi</a>
    </div>
  );
};
