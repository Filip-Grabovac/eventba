import React from "react";
import ProfileIcon from "../../assets/ikonice/profile_user_icon.svg";
import check from "../../assets/ikonice/check2_icon.svg";

export const ProfileLeft = (props) => {
  const profileData = props.profileData;

  return (
    <div className="hero-profile">
      <div className="top-profile">
        <img
          style={
            !props.profileData.profile_img ? { height: "30px" } : undefined
          }
          src={
            props.profileData.profile_img
              ? props.profileData.profile_img
              : ProfileIcon
          }
          alt=""
        />
        <h4>
          {profileData.full_name.split(" ")[0]}{" "}
          {profileData.full_name.split(" ")[1]}
        </h4>
        {profileData.is_verified ? (
          <div style={{ textAlign: "center" }}>
            <small style={{ color: "green", textAlign: "center" }}>
              {" "}
              Verificiran
            </small>
            <img src={check} style={{ height: "30px" }} alt="check" />
          </div>
        ) : (
          <small style={{ color: "red", textAlign: "center" }}>
            {" "}
            Neverificiran!
          </small>
        )}
      </div>
      <div className="info">
        <p>
          Ime: <span>{profileData.full_name.split(" ")[0]}</span>
        </p>
        <p>
          Prezime: <span>{profileData.full_name.split(" ")[1]}</span>
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
          <span>{profileData.phone ? `${profileData.phone}` : ""}</span>
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
