import React from "react";
import profilePicture from "../../assets/images/profileHero.png";

export const Hero = () => {
  return (
    <div className="hero-profile">
      <h1>Anto Matić</h1>
      <img src={profilePicture} alt="" />
      <div className="info">
        <p>
          Age: <span>33</span>
        </p>
        <p>
          Location: <span>Vitez, Bosna i Hercegovina</span>
        </p>
      </div>
    </div>
  );
};
