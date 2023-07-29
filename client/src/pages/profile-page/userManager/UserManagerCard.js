import React, { useEffect, useState } from 'react';
import UserManagerIcon from '../../../assets/ikonice/user_manager_icon.svg';
import UserManagerCheck from '../../../assets/ikonice/user_manager_check.svg';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import TrashCanIcon from '../../../assets/ikonice/trash_can.svg';
import BanUser from '../../../assets/ikonice/ban_user_icon.svg';
import UnBanUser from '../../../assets/ikonice/user_unban_icon.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';
import { Tooltip } from 'react-tooltip';

export const UserManagerCard = ({ data, removeUserFromUI }) => {
  const [userData, setUserData] = useState(data);
  const [selectedRole, setSelectedRole] = useState();
  const roles = ['Standard', 'Reseller', 'Organizer', 'Admin'];
  const translatedRoles = ['Standard', 'Preprodavač', 'Organizator', 'Admin'];

  // Always update isBanned status at the beggining so images can change related to it
  useEffect(() => {
    setUserData(data);
    setSelectedRole(data.role[0].toUpperCase() + data.role.slice(1));
  }, [data]);

  // Update user ban status
  function setUserBanStatus(e) {
    axios
      .patch(
        process.env.REACT_APP_API_URL +
          `/api/v1/users/set_ban/${userData._id}/${!userData.isBanned}`
      )
      .then(() => {
        // Display messages and update ban status
        let msg = !userData.isBanned
          ? 'Uspješno ste blokirali korisnika'
          : 'Uspješno ste odblokirali korisnika';
        toast.success(msg, toastSetup('top-right', 2000));

        setUserData((prevUserData) => ({
          ...prevUserData,
          isBanned: !prevUserData.isBanned,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Update user role
  const handleRoleChange = (e) => {
    const selectValue = e.target.value;
    setSelectedRole(selectValue);

    axios
      .patch(
        process.env.REACT_APP_API_URL +
          `/api/v1/users/update_user_role/${
            userData._id
          }/${selectValue.toLowerCase()}`
      )
      .then((res) => {
        // Display messages and update ban status
        toast.success(res.data.message, toastSetup('top-right', 2000));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Delete user
  function deleteUser() {
    removeUserFromUI(userData._id);

    axios
      .delete(
        process.env.REACT_APP_API_URL +
          `/api/v1/users/delete_user/${userData._id}`
      )
      .then((response) => {
        toast.success(response.data.message, toastSetup('top-right', 2000));
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }

  return (
    <div className="user-manager-card">
      <Tooltip
        style={{ borderRadius: '10px', backgroundColor: '#455cd9' }}
        anchorId="ban-img"
        place="bottom"
        variant="info"
        content={
          userData.isBanned
            ? 'Odblokirajte korisnika.'
            : 'Blokirajte korisnika.'
        }
      />
      <Tooltip
        style={{ borderRadius: '10px', backgroundColor: '#455cd9' }}
        anchorId="delete-user-icon"
        place="bottom"
        variant="info"
        content="Obrišite korisnika."
      />
      <Tooltip
        style={{ borderRadius: '10px', backgroundColor: '#455cd9' }}
        anchorId="role-selector"
        place="top"
        variant="info"
        content="Promjenite tip računa."
      />
      <img className="user" src={UserManagerIcon} alt="User" />
      <div className="um-card-part">
        <p>{userData.fullName}</p>
        <p>{userData.email}</p>
      </div>
      <div className="um-line"></div>
      <div className="um-card-part um-middle-part">
        {userData.country ? (
          <p>
            {userData.country}, {userData.city}
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
        <select
          name="role"
          id="role-selector"
          className="role-selector"
          value={selectedRole}
          onChange={handleRoleChange}
        >
          <option value={selectedRole}>
            {translatedRoles[roles.indexOf(selectedRole)]}
          </option>
          {roles.map((e, i) => {
            if (selectedRole !== e) {
              return (
                <option key={i} value={e}>
                  {translatedRoles[i]}
                </option>
              );
            } else {
              return null;
            }
          })}
        </select>
      </div>
      <div className="um-line"></div>
      <div className="um-icons-wrapper">
        <div
          onClick={() => {
            deleteUser();
          }}
          id="delete-user-icon"
        >
          <img src={TrashCanIcon} alt="Trash Can" />
        </div>
        <div
          id="ban-img"
          onClick={(e) => {
            setUserBanStatus(e);
          }}
        >
          <img src={userData.isBanned ? UnBanUser : BanUser} alt="Unban User" />
        </div>
      </div>
    </div>
  );
};
