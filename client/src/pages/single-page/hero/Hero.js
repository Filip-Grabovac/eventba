import React from "react";
import MainCard from "./MainCard";
import { SecondaryCard } from "./SecondaryCard";

const Hero = () => {
  return (
    <div className="container-fluid single-page-hero">
      <MainCard />
      <SecondaryCard />
    </div>
  );
};

export default Hero;
