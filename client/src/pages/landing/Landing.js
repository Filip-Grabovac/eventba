import React from 'react';
import Hero from './hero/Hero';
import { ThisWeek } from '../../components/this-week/ThisWeek';

export const Landing = () => {
  return (
    <div>
      <Hero />
      <ThisWeek heading="Ovaj tjedan" />
    </div>
  );
};
