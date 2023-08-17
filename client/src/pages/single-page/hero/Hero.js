import React from 'react';
import MainCard from './MainCard';
import { SecondaryCard } from './SecondaryCard';

const Hero = (props) => {
  return (
    <div className="container-fluid single-page-hero">
      <MainCard concertData={props.concertData} />
      <SecondaryCard id={props.id} concertData={props.concertData} />
    </div>
  );
};

export default Hero;
