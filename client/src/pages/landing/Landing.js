import React from "react";
import Hero from "./hero/Hero";
import { ThisWeek } from "../../components/thisWeek/ThisWeek";

export const Landing = () => {
  return (
    <div>
      <Hero />
      <ThisWeek heading="Ovaj tjedan" />
    </div>
  );
};
