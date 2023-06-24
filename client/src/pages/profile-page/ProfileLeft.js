import React from "react";
import profilePicture from "../../assets/images/profileHero.png";

export const ProfileLeft = (props) => {
  const profileData = props.profileData;
  return (
    <div className="hero-profile">
      <h1>
        {profileData.name} {profileData.lname}
      </h1>
      <img src={profileData.profileImg} alt="" />
      <div className="info">
        <p>
          Age: <span>33</span>
        </p>
        <p>
          Location:{" "}
          <span>
            {profileData.city} {profileData.country}
          </span>
        </p>
      </div>
    </div>
  );
};
