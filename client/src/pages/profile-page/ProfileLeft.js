import React from "react";
import ProfileIcon from "../../assets/ikonice/profile_user_icon.svg";

export const ProfileLeft = (props) => {
  const profileData = props.profileData;

  return (
    <div className="hero-profile">
      <div className="top">
        <img
          style={!props.profileData.profileImg ? { height: "30px" } : undefined}
          src={
            props.profileData.profileImg
              ? props.profileData.profileImg
              : ProfileIcon
          }
          alt=""
        />
        <h4>
          {profileData.name} {profileData.lname}
        </h4>
      </div>
      <div className="info">
        <p>
          Ime: <span>{profileData.name}</span>
        </p>
        <p>
          Prezime: <span>{profileData.lname}</span>
        </p>
        <p>
          Email: <span>{profileData.email}</span>
        </p>
        <p>
          Adresa:{" "}
          <span>
            {profileData.address
              ? `${profileData.address}, ${profileData.city}, ${profileData.zip}`
              : ""}
          </span>
        </p>
        <p>
          Država: <span>{profileData.country}</span>
        </p>
        <p>
          Mob/Tel :{" "}
          <span>{profileData.phone ? `+387 ${profileData.phone}` : ""}</span>
        </p>
        {profileData.role !== "standard" ? (
          <p>
            Vrsta računa:
            <span>
              {profileData.role === "admin"
                ? "Admin"
                : profileData.role === "reseller"
                ? "Preprodavac"
                : profileData.role === "organizer"
                ? "Organizator"
                : ""}
            </span>
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
