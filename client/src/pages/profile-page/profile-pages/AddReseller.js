import React, { useState } from "react";
import InfoIcon from "../../../assets/ikonice/info.svg";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import { toast } from "react-toastify";

export const AddReseller = () => {
  const [userEmail, setUserEmail] = useState();
  const toastSetup = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/users/update_user/email/${userEmail}`
      );

      toast.success(`${response.data.message}`, toastSetup);
      document.querySelector(".email-input").value = "";
    } catch (error) {
      // Handle errors if any
      console.error(error);
    }
  }
  return <div></div>;
};
