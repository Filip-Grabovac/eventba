import React, { useEffect, useState } from "react";
import { Hero } from "./Hero";
import { ProfileForm } from "./ProfileForm";
import axios from "axios";
import { useSelector } from "react-redux";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const userId = useSelector((state) => state.user);

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
      <Hero profileData={profileData} />
      <ProfileForm profileData={profileData} />
    </div>
  );
};
