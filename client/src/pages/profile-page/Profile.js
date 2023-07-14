import React, { useEffect, useState } from "react";
import { ProfileLeft } from "./ProfileLeft";
import { ProfileForm } from "./ProfileForm";
import axios from "axios";
import { useSelector } from "react-redux";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const userId = useSelector((state) => state.userState.user);
  const [navItems, setNavItems] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState("Ažuriraj podatke");

  const [entranceData, setEntranceData] = useState();

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/id/${userId}`
      );
      setProfileData(response.data);

      // Set profile navbar based on role
      if (response.data.role === "standard") {
        setNavItems(["Ažuriraj podatke", "Moje ulaznice"]);
      } else if (response.data.role === "reseller") {
        setNavItems(["Ažuriraj podatke", "Prodajna statistika"]);
      } else if (response.data.role === "organizer") {
        setNavItems([
          "Ažuriraj podatke",
          "Organiziraj događaj",
          "Postavke ulaza",
          "Dodaj dvoranu",
        ]);
      } else if (response.data.role === "admin") {
        setNavItems(["Ažuriraj podatke", "Admin postavke"]);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchEntranceCheckers = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/entrance_controllers`,
        { id: id }
      );
      setEntranceData(response.data);
    } catch (error) {
      console.error("Error fetching entrance checker:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchEntranceCheckers(userId);
  }, []);

  const handleProfileFormSubmit = () => {
    fetchProfileData();
  };

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
          <div className="col-lg-6">
            <nav>
              <ul>
                {navItems &&
                  navItems.map((e, i) => {
                    return (
                      <li key={i}>
                        <a
                          className={`${
                            activeNavItem === e ? "active-profile-nav-link" : ""
                          }`}
                          onClick={() => {
                            setActiveNavItem(e);
                          }}
                          href="#"
                        >
                          {e}
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </nav>
            <ProfileForm
              activeNavItem={activeNavItem}
              profileData={profileData}
              entranceData={entranceData}
              onProfileFormSubmit={handleProfileFormSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
