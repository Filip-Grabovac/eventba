import React, { useEffect, useState } from "react";
import UserManagerIcon from "../../../assets/ikonice/user_manager_icon.svg";
import UserManagerCheck from "../../../assets/ikonice/user_manager_check.svg";
import TrashCanIcon from "../../../assets/ikonice/trash_can.svg";
import BanUser from "../../../assets/ikonice/ban_user_icon.svg";
import UnBanUser from "../../../assets/ikonice/user_unban_icon.svg";
import axios from "axios";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";

export const UserManagerCard = ({ data, removeUserFromUI }) => {
  const [userData, setUserData] = useState(data);
  const [selectedRole, setSelectedRole] = useState();
  const roles = ["standard", "organizer", "admin"];

  const { t } = useTranslation();

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
          ? "Uspješno ste blokirali korisnika"
          : "Uspješno ste odblokirali korisnika";
        toast.success(msg, toastSetup("top-right", 2000));

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
        toast.success(res.data.message, toastSetup("top-right", 2000));
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
        toast.success(response.data.message, toastSetup("top-right", 2000));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  }

  return (
    <div className="user-manager-card">
      <img className="user" src={UserManagerIcon} alt="User" />
      <div className="card-part-half">
        <div className="um-card-part">
          <p>{userData.full_name}</p>
          <p>{userData.email}</p>
        </div>
        <div className="um-line"></div>
        <div className="um-card-part um-middle-part">
          {userData.country ? (
            <p>
              {userData.country}, {userData.city}
            </p>
          ) : (
            ""
          )}
          {userData.is_verified ? (
            <p className="is-verified">
              Verificiran: <img src={UserManagerCheck} alt="Check" />
            </p>
          ) : (
            <p style={{ color: "red" }}>Neverificiran</p>
          )}
        </div>
      </div>
      <div className="card-part-half">
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
              {t(`role.${selectedRole && selectedRole.toLowerCase()}`)}
            </option>
            {roles.map((e, i) => {
              if (selectedRole && selectedRole.toLowerCase() !== e) {
                return (
                  <option key={i} value={e}>
                    {t(`role.${roles[i]}`)}
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
            <img
              src={userData.isBanned ? UnBanUser : BanUser}
              alt="Unban User"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
