import React from "react";
import { UpdateProfilePage } from "./profile-pages/UpdateProfilePage.js";
import { useSelector } from "react-redux";
import { OrganizeEventPage } from "./profile-pages/OrganizeEventPage.js";

export function ProfileForm(props) {
  return (
    <div className="profile-form">
      {props.activeNavItem === "Ažuriraj podatke" ? (
        <UpdateProfilePage
          profileData={props.profileData}
          onProfileFormSubmit={props.onProfileFormSubmit}
        />
      ) : props.activeNavItem === "Organiziraj događaj" ? (
        <OrganizeEventPage />
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileForm;
