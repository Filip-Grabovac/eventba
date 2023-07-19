import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import { toastSetup } from "../functions/toastSetup";

export const Verification = () => {
  const { verificationCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.patch(
          `/api/v1/users/verify/${verificationCode}`
        );

        setTimeout(() => {
          navigate("/");
          toast.success(response.data.msg, toastSetup("top-right", 3000));
        }, 1000);
      } catch (error) {
        setTimeout(() => {
          navigate("/");
          toast.error(
            "Verifikacija nije uspjela!",
            toastSetup("top-right", 3000)
          );
        }, 1000);
      }
    };
    verifyUser();
  }, [verificationCode]);

  return (
    <div className="verification">
      <h3>Verifikacija u tijeku...</h3>
      <div className="loader">
        <Bars
          height="80"
          width="80"
          color="#455cd9"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </div>
  );
};
