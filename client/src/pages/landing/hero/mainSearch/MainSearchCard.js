import React from "react";
import { Link } from "react-router-dom";
import SearchImg from "../../../../assets/images/search_card_img.png";

const MainSearchCard = () => {
  return (
    <div className="search-card-container">
      <img src={SearchImg} alt="Poster Image" />
      <div className="card-info-wrapper">
        <h3>Matija Cvek</h3>
        <p>07.jun.2023 22:00 - Bitefartcafe, Beograd</p>
      </div>
      <div className="card-btns-wrapper">
        <Link to="/single">Pogledaj</Link>
        <Link to="">Kupi</Link>
      </div>
    </div>
  );
};

export default MainSearchCard;
