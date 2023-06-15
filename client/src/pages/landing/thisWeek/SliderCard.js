import React from "react";
import photo1 from "../../../assets/this-week/this-week1.png";
import photo2 from "../../../assets/this-week/this-week2.png";
import photo3 from "../../../assets/this-week/this-week3.png";

export const SliderCard = () => {
  const description = "";
  return (
    <div className="slider-card">
      <img src={photo1} alt={description} />
      <p className="type">FESTIVAL</p>
      <p className="performer">Indirekt-Music & Art Festival</p>
      <p className="date">09.06.2023</p>
      <p className="location">Umag (Slavudrija)</p>
    </div>
  );
};
