import React from 'react';
import { UpdateProfilePage } from './profile-pages/UpdateProfilePage.js';
import { OrganizeEventPage } from './organizeEventPage/OrganizeEventPage.js';
import { AdminSettings } from './profile-pages/AdminSettings.js';
import { EntranceChecker } from './entranceController/AddEntranceChecker.js';
import { AddHall } from './profile-pages/AddHall.js';
import { MyTickets } from './MyTicket/MyTickets.js';

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
      ) : props.activeNavItem === 'Admin postavke' ? (
        <AdminSettings />
      ) : props.activeNavItem === 'Postavke ulaza' ? (
        <EntranceChecker
          organizerEvents={props.organizerEvents}
          entranceData={props.entranceData}
        />
      ) : props.activeNavItem === 'Dodaj dvoranu' ? (
        <AddHall />
      ) : props.activeNavItem === 'Moje ulaznice' ? (
        <MyTickets buyHistory={props.buyHistory} />
      ) : (
        ''
      )}
    </div>
  );
}

export default ProfileForm;
