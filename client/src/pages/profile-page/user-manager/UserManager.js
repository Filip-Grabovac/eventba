import React, { useEffect, useState } from "react";
import { UserManagerCard } from "./UserManagerCard";
import axios from "axios";
import { ProfileTopPart } from "./ProfileTopPart";
import { toastSetup } from "../../../functions/toastSetup";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { setLoginIsOpen } from "../../../store/loginSlice";

export const UserManager = () => {
  const [data, setData] = useState("Pretraži korisnike");

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userState.user);
  const token = useSelector((state) => state.userState.token);
  const fetchData = async (e) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL +
          `/api/v1/users/search/${e.target.value}`,
        { userId, token }
      );
      setData(response.data);
    } catch (error) {
      setData("Pretraži korisnike");
      if (error.response.status === 401) {
        dispatch(setLoginIsOpen(true));
      }

      toast.error(
        `Došlo je do pogreške pretraživanja. ${
          error?.response?.data.message || ""
        }`,
        toastSetup("top-center", 3000)
      );
    }
  };

  // Update UI
  async function removeUserFromUI(id) {
    setData((prevData) => ({
      ...prevData,
      users: prevData.users.filter((user) => user._id !== id),
    }));
  }

  // If last user is deleted
  useEffect(() => {
    if (typeof data === "object" && data.users[0] === undefined) {
      setData("Pretraži korisnike");
    }
  }, [data]);

  return (
    <div>
      <ProfileTopPart
        fetchData={fetchData}
        content="Lista korisnika"
        hasSearch={true}
        searchContent="Email/Korisničko ime"
      />
      <div className="user-manager-bottom">
        {data && typeof data === "object" ? (
          data.users.map((e, i) => {
            return (
              e && (
                <UserManagerCard
                  data={e}
                  removeUserFromUI={removeUserFromUI}
                  key={i}
                />
              )
            );
          })
        ) : (
          <p className="no-searched-users">{data}</p>
        )}
      </div>
    </div>
  );
};
