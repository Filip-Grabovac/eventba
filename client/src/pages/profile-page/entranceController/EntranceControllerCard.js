import React, { useState } from 'react';
import TrashCan from '../../../assets/ikonice/trash_can.svg';
import Edit from '../../../assets/ikonice/edit_icon.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const EntranceControllerCard = ({
  e,
  setUpdateData,
  setButtonContent,
}) => {
  const [isDeleted, setDeletion] = useState(false);

  // Delete entrance controller
  async function deleteEntranceController(id) {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL +
          `/api/v1/entrance_controllers/delete_controller`,
        { id }
      );
      toast.success(response.data.message, toastSetup('top-right', 2000));
      setDeletion(true);
      setUpdateData();
    } catch (error) {
      console.error(error);
    }
  }

  function editEntranceController(id) {
    setUpdateData({
      controller_id: id,
      controller_name: e.name,
      event: e.event,
      entrance_num: e.entrance_num,
    });
    setButtonContent('Završi uređivanje');
  }

  if (!isDeleted) {
    return (
      <div className="control-acc-wrapper">
        <p>{e.name}</p>
        <div className="control-line"></div>
        <p>{e.event}</p>
        <div className="control-line"></div>
        <p>Ulaz: {e.entrance_num}</p>
        <img
          onClick={() => {
            deleteEntranceController(e._id);
          }}
          src={TrashCan}
          alt="Delete"
        />
        <img
          onClick={() => {
            editEntranceController(e._id);
          }}
          src={Edit}
          alt="Uredi"
        />
      </div>
    );
  }
};
