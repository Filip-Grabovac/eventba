import React from "react";
import SinglePageCover from "../../assets/images/search_card_img.png";
import Hero from "./hero/Hero";

const SinglePage = () => {
  return (
    <div className="single-page-container">
      <div className="single-page-top">
        <img src={SinglePageCover} alt="" />
        <div className="cover-overlay"></div>
      </div>
      <Hero />
    </div>
  );
};

export default SinglePage;
