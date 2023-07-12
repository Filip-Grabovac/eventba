import React, { useState } from "react";
import TrashCan from "../../assets/ikonice/trash_can.svg";
import axios from "axios";
import { toast } from "react-toastify";

export const EntranceControllerCard = (props) => {
  const [isDeleted, setDeletion] = useState(false);

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

  // Delete entrance controller
  async function deleteEntranceController(id) {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL +
          `/api/v1/entrance_controllers/delete_controller`,
        { id }
      );
      toast.success(response.data.message, toastSetup);
      setDeletion(true);
    } catch (error) {
      console.error(error);
    }
  }

  if (!isDeleted) {
    return (
      <div className="control-acc-wrapper">
        <p>{props.e.name}</p>
        <div className="control-line"></div>
        <p>{props.e.event}</p>
        <div className="control-line"></div>
        <p>Ulaz: {props.e.entrance_num}</p>
        <img
          onClick={() => {
            deleteEntranceController(props.e._id);
          }}
          src={TrashCan}
          alt="Delete"
        />
      </div>
    );
  }
};
