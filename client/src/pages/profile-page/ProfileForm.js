import React from "react";
import { UpdateProfilePage } from "./update-profile-page/UpdateProfilePage";
import { OrganizeEventPage } from "./organize-event-page/OrganizeEventPage.js";
import { UserManager } from "./user-manager/UserManager.js";
import { EntranceChecker } from "./entrance-controller/AddEntranceChecker.js";
import { AddObject } from "./profile-pages/AddObject.js";
import { RequestReseller } from "./profile-pages/RequestResseler.js";
import { MyTickets } from "./my-ticket/MyTickets.js";
import { MyEvent } from "./my-events/MyEvent.js";
import { ResellerRequest } from "./reseller-requests/ResellerRequest.js";
import { AddTickets } from "./add-tickets/AddTickets.js";
import { AddReseller } from "./add-reseller-for-organizer/AddReseller.js";
import { CheckResellerTickets } from "./check-reseller-tickets/CheckResellerTickets.js";
import { VerifyEvents } from "./verify-events/VerifyEvents";
import { NewsLetter } from "./newsletter-profile/NewsLetter";

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
      ) : props.activeNavItem === "Upravljaj korisnicima" ? (
        <UserManager />
      ) : props.activeNavItem === "Postavke ulaza" ? (
        <EntranceChecker
          organizerEvents={props.organizerEvents}
          entranceData={props.entranceData}
        />
      ) : props.activeNavItem === "Dodaj objekat" ? (
        <AddObject />
      ) : props.activeNavItem === "Moje ulaznice" ? (
        <MyTickets buy_history={props.buy_history} />
      ) : props.activeNavItem === "Moji događaji" ? (
        <MyEvent organizerEvents={props.organizerEvents} />
      ) : props.activeNavItem === "Zatraži preprodavača" ? (
        <RequestReseller profileData={props.profileData} />
      ) : props.activeNavItem === "Zahtjevi preprodavača" ? (
        <ResellerRequest resellersRequests={props.resellersRequests} />
      ) : props.activeNavItem === "Dodaj ulaznice" ? (
        <AddTickets adminEmail={props.profileData.email} />
      ) : props.activeNavItem === "Dodaj preprodavača" ? (
        <AddReseller resellers={props.resellers} />
      ) : props.activeNavItem === "Pregled prodaje" ? (
        <CheckResellerTickets
          resellerInfo={props.profileData.reseller_info}
          reseller_id={props.profileData._id}
        />
      ) : props.activeNavItem === "Odobri događaj" ? (
        <VerifyEvents />
      ) : props.activeNavItem === "Newsletter" ? (
        <NewsLetter profileData={props.profileData} />
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileForm;
