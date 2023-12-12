import React, { useEffect, useState } from "react";
import axios from "axios";
import { toastSetup } from "../../../functions/toastSetup";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { setLoginIsOpen } from "../../../store/loginSlice";
import DevExpress from "./devexpress/DevExpressGrid";

export const UserManager = () => {
  const [data, setData] = useState("Pretraži korisnike");

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userState.user);
  const token = useSelector((state) => state.userState.token);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/users/get_all_users`,
        {
          userId: userId,
          token: token,
        }
      );
      setData(response.data);
    } catch (error) {
      setData("Pretraži korisnike");
      if (error.response && error.response.status === 401) {
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

  useEffect(() => {
    fetchData();
  }, []);

  return <DevExpress data={data.users} token={token} />;
};
