import axios from "axios";
import React, { useEffect, useState } from "react";

export const AddOrganizer = ({ setOrganizer, organizer }) => {
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/organizer`
      );
      setOrganizers(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleOrganizerChange = (event) => {
    setOrganizer(event.target.value);
  };
  return (
    organizers && (
      <div className="add-organizer" style={{ width: "45%" }}>
        <select
          style={{ width: "100%" }}
          id="organizerDropdown"
          value={organizer || ""}
          onChange={handleOrganizerChange}
        >
          <option value="">Dodjeli organizatora</option>
          {organizers.map((organizer) => (
            <option key={organizer._id} value={organizer._id}>
              {organizer.full_name}
            </option>
          ))}
        </select>
      </div>
    )
  );
};
