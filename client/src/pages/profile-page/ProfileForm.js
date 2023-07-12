import React from "react";
import { UpdateProfilePage } from "./profile-pages/UpdateProfilePage.js";
import { useSelector } from "react-redux";
import { OrganizeEventPage } from "./profile-pages/OrganizeEventPage.js";
import { AdminSettings } from "./profile-pages/AdminSettings.js";
import { AddReseller } from "./profile-pages/AddReseller.js";

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
      ) : props.activeNavItem === "Admin postavke" ? (
        <AdminSettings />
      ) : props.activeNavItem === "Dodatne postavke" ? (
        <AddReseller />
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileForm;
