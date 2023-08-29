import React, { useEffect, useState } from "react";
import { ProfileLeft } from "./ProfileLeft";
import { ProfileForm } from "./ProfileForm";
import axios from "axios";
import { useSelector } from "react-redux";
import ProfileIcon from "../../assets/ikonice/profile_user_icon.svg";
import { Tooltip } from "react-tooltip";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const userId = useSelector((state) => state.userState.user);
  const [navItems, setNavItems] = useState([]);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [buy_history, setBuyHistory] = useState([]);
  const [resellersRequests, setResellersRequests] = useState([]);
  const [resellers, setResellers] = useState();
  const [isInfoVisible, setInfoVisibility] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Ažuriraj podatke");

  const [entranceData, setEntranceData] = useState();

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/id/${userId}`
      );
      setProfileData(response.data);
      setBuyHistory(response.data.buy_history);

      // Set profile navbar based on role
      if (response.data.role === "standard") {
        setNavItems([
          "Ažuriraj podatke",
          "Moje ulaznice",
          "Zatraži preprodavača",
          "Newsletter",
        ]);
      } else if (response.data.role === "reseller") {
        setNavItems([
          "Ažuriraj podatke",
          "Moje ulaznice",
          "Pregled prodaje",
          "Newsletter",
        ]);
      } else if (response.data.role === "organizer") {
        setNavItems([
          "Ažuriraj podatke",
          "Moje ulaznice",
          "Organiziraj događaj",
          "Postavke ulaza",
          "Dodaj dvoranu",
          "Moji događaji",
          "Dodaj preprodavača",
        ]);

        fetchEntranceCheckers(userId);
        fetchOrganizerConcerts(userId);
        fetchAllResellers();
      } else if (response.data.role === "admin") {
        setNavItems([
          "Ažuriraj podatke",
          "Moje ulaznice",
          "Organiziraj događaj",
          "Dodaj ulaznice",
          "Moji događaji",
          "Postavke ulaza",
          "Dodaj preprodavača",
          "Odobri događaj",
          "Upravljaj korisnicima",
          "Dodaj dvoranu",
          "Zahtjevi preprodavača",
        ]);
        fetchEntranceCheckers(userId);
        fetchOrganizerConcerts(userId);
        fetchResellerRequests();
        fetchAllResellers();
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

  const fetchOrganizerConcerts = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/organizer/${id}`
      );
      setOrganizerEvents(response.data);
    } catch (error) {
      console.error("Error fetching entrance checker:", error);
    }
  };

  const fetchResellerRequests = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/get_all_resellers`
      );
      setResellersRequests(response.data);
    } catch (error) {
      console.error("Error fetching entrance checker:", error);
    }
  };

  const fetchAllResellers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/role/reseller`
      );
      setResellers(response.data);
    } catch (error) {
      console.error("Error fetching entrance checker:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleProfileFormSubmit = () => {
    fetchProfileData();
  };

  if (!profileData) {
    return;
  }

  function showProfileInfo() {
    setInfoVisibility(!isInfoVisible);
  }

  return (
    <div className="profile">
      <Tooltip
        style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
        anchorId="profile-info-icon"
        place="bottom"
        variant="info"
        content="Otvori dodatne informacije."
      />
      {isInfoVisible ? (
        <div onClick={showProfileInfo} className="blur"></div>
      ) : null}
      {isInfoVisible ? <ProfileLeft profileData={profileData} /> : null}
      <nav>
        <ul>
          <li className="profile-img-li">
            <img
              id="profile-info-icon"
              onClick={showProfileInfo}
              src={ProfileIcon}
              alt="Profile"
            />
          </li>
          <div className="profile-links-wrapper">
            {navItems &&
              navItems.map((e, i) => {
                return (
                  <li key={i}>
                    <a
                      className={`${
                        activeNavItem === e ? "active-profile-nav-link " : ""
                      }${
                        e === "Dodaj preprodavača" ? "add-reseller-link" : ""
                      }`}
                      onClick={(event) => {
                        event.preventDefault();
                        setActiveNavItem(e);
                      }}
                      href="#"
                    >
                      {e}
                    </a>
                  </li>
                );
              })}
          </div>
        </ul>
      </nav>
      <ProfileForm
        activeNavItem={activeNavItem}
        profileData={profileData}
        entranceData={entranceData}
        onProfileFormSubmit={handleProfileFormSubmit}
        buy_history={buy_history}
        resellersRequests={resellersRequests}
        organizerEvents={organizerEvents}
        resellers={resellers}
      />
    </div>
  );
};
