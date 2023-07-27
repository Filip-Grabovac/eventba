import React, { useState } from 'react';
import UserManagerIcon from '../../../assets/ikonice/user_manager_icon.svg';
import UserManagerCheck from '../../../assets/ikonice/user_manager_check.svg';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import TrashCanIcon from '../../../assets/ikonice/trash_can.svg';
import BanUser from '../../../assets/ikonice/ban_user_icon.svg';
import UnBanUser from '../../../assets/ikonice/user_unban_icon.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const UserManagerCard = ({ data }) => {
  const [isBanned, setIsBanned] = useState(data.isBanned);

  function setUserBanStatus(e) {
    // Toggle the isBanned state
    setIsBanned((prevIsBanned) => !prevIsBanned);

    axios
      .patch(
        process.env.REACT_APP_API_URL +
          `/api/v1/users/set_ban/${data._id}/${isBanned}`
      )
      .then((response) => {
        console.log(response.data);
        let msg = !isBanned
          ? 'Uspješno ste banovali korisnika'
          : 'Uspješno ste unbanovali korisnika';
        toast.success(msg, toastSetup('top-right', 2000));

        // The ban status has been updated successfully
      })
      .catch((error) => {
        console.error(error);
        // Handle error if request fails
      });
  }

  return (
    <div className="user-manager-card">
      <img className="user" src={UserManagerIcon} alt="User" />
      <div className="um-card-part">
        <p>{data.fullName}</p>
        <p>{data.email}</p>
      </div>
      <div className="um-line"></div>
      <div className="um-card-part um-middle-part">
        {data.country ? (
          <p>
            {data.country}, {data.city}
          </p>
        ) : (
          ''
        )}
        <p className="is-verified">
          Verificiran: <img src={UserManagerCheck} alt="Check" />
        </p>
      </div>
      <div className="um-line"></div>
      <div className="um-card-part um-last-part">
        <p className="set-user-role">
          {data.role[0].toUpperCase() + data.role.slice(1)}{' '}
          <img src={ArrowIcon} alt="Arrow" />
        </p>
      </div>
      <div className="um-line"></div>
      <div className="um-icons-wrapper">
        <div>
          <img src={TrashCanIcon} alt="Trash Can" />
        </div>
        <div
          onClick={(e) => {
            setUserBanStatus(e);
          }}
        >
          {isBanned ? (
            <img src={UnBanUser} alt="Unban User" />
          ) : (
            <img src={BanUser} alt="Ban User" />
          )}
        </div>
      </div>
    </div>
  );
};
