import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastSetup } from "../functions/toastSetup";

export const PasswordReset = () => {
  const { requestNumber } = useParams();
  const newPassword =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  useEffect(() => {
    const resetPassword = async () => {
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/v1/helper/reset_password/${requestNumber}`,
          { password: newPassword } // Sending encrypted password in the request body
        );

        toast.success(response.data.msg, toastSetup("top-right", 3000));
      } catch (error) {
        toast.error(error.response.data.msg, toastSetup("top-right", 3000));
      }
    };
    resetPassword();
  }, [requestNumber]);

  return (
    <div className="verification">
      <h3>Vaša nova lozinka je: </h3>
      <h2>
        <strong>{newPassword}</strong>
      </h2>
    </div>
  );
};
