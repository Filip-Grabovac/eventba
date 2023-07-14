import React from "react";
import { UpdateProfilePage } from "./profile-pages/UpdateProfilePage.js";
import { OrganizeEventPage } from "./profile-pages/OrganizeEventPage.js";
import { AdminSettings } from "./profile-pages/AdminSettings.js";
import { EntranceChecker } from "./profile-pages/AddEntranceChecker.js";
import { AddHall } from "./profile-pages/AddHall.js";

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
      ) : props.activeNavItem === "Postavke ulaza" ? (
        <EntranceChecker entranceData={props.entranceData} />
      ) : props.activeNavItem === "Dodaj dvoranu" ? (
        <AddHall />
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileForm;
