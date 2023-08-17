import React from 'react';
import ImageSlider from './slider/ImageSlider';
import MainSearch from './main-search/MainSearch';

const Hero = () => {
  return (
    <div className="hero">
      <ImageSlider />
      <MainSearch />
    </div>
  );
};

export default Hero;
