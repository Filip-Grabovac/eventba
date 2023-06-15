import React from "react";
import SinglePageCover from "../../assets/images/test.png";
import Hero from "./hero/Hero";
import { ThisWeek } from "../landing/thisWeek/ThisWeek";

const SinglePage = () => {
  return (
    <div className="single-page-container">
      <div className="single-page-top">
        <img src={SinglePageCover} alt="" />
        <div className="cover-overlay"></div>
      </div>
      <Hero />
      <ThisWeek heading="Iz iste sekcije" />
    </div>
  );
};

export default SinglePage;
