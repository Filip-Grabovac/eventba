import React, { useEffect, useState } from "react";
import { ProfileLeft } from "./ProfileLeft";
import { ProfileForm } from "./ProfileForm";
import axios from "axios";
import { useSelector } from "react-redux";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const userId = useSelector((state) => state.userState);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/id/${userId}`
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return;
  }
  return (
    <div className="profile">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3">
            <ProfileLeft profileData={profileData} />
          </div>
          <div className="col-lg-9">
            <ProfileForm profileData={profileData} />
          </div>
        </div>
      </div>
    </div>
  );
};
