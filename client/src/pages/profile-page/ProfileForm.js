import React from 'react';
import { UpdateProfilePage } from './profile-pages/UpdateProfilePage.js';
import { OrganizeEventPage } from './organizeEventPage/OrganizeEventPage.js';
import { UserManager } from './userManager/UserManager.js';
import { EntranceChecker } from './entranceController/AddEntranceChecker.js';
import { AddHall } from './profile-pages/AddHall.js';
import { RequestReseller } from './profile-pages/RequestResseler.js';
import { MyTickets } from './MyTicket/MyTickets.js';
import { MyEvent } from './MyEvents/MyEvent.js';
import { ResellerRequest } from './resellerRequests/ResellerRequest.js';
export function ProfileForm(props) {
  return (
    <div className="profile-form">
      {props.activeNavItem === 'Ažuriraj podatke' ? (
        <UpdateProfilePage
          profileData={props.profileData}
          onProfileFormSubmit={props.onProfileFormSubmit}
        />
      ) : props.activeNavItem === 'Organiziraj događaj' ? (
        <OrganizeEventPage />
      ) : props.activeNavItem === 'Upravljaj korisnicima' ? (
        <UserManager />
      ) : props.activeNavItem === 'Postavke ulaza' ? (
        <EntranceChecker
          organizerEvents={props.organizerEvents}
          entranceData={props.entranceData}
        />
      ) : props.activeNavItem === 'Dodaj dvoranu' ? (
        <AddHall />
      ) : props.activeNavItem === 'Moje ulaznice' ? (
        <MyTickets buyHistory={props.buyHistory} />
      ) : props.activeNavItem === 'Moji događaji' ? (
        <MyEvent organizerEvents={props.organizerEvents} />
      ) : props.activeNavItem === 'Zatraži preprodavača' ? (
        <RequestReseller />
      ) : props.activeNavItem === 'Zahtjevi preprodavača' ? (
        <ResellerRequest />
      ) : (
        ''
      )}
    </div>
  );
}

export default ProfileForm;
