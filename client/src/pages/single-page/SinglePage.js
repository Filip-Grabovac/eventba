import React, { useEffect, useState } from "react";
import Hero from "./hero/Hero";
import { ThisWeek } from "../../components/thisWeek/ThisWeek";
import axios from "axios";
import PromotedIcon from "../../assets/ikonice/promoted_icon.svg";
import UnPromotedIcon from "../../assets/ikonice/unpromoted_icon.svg";
import SuggestedIcon from "../../assets/ikonice/suggested_icon.svg";
import UnSuggestedIcon from "../../assets/ikonice/unsuggested_icon.svg";
import { toast } from "react-toastify";
import { toastSetup } from "../../functions/toastSetup";
import { useSelector } from "react-redux";

const SinglePage = () => {
  const [concertData, setConcertData] = useState(null);
  const [userRole, setUserRole] = useState();
  const [propertyChanged, setProperty] = useState();
  const id = new URLSearchParams(new URL(window.location.href).search).get(
    "id"
  );
  const userId = useSelector((state) => state.userState.user);

  // Fetch the data at the beggining
  useEffect(() => {
    const fetchSinglePage = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${id}`
        );
        setConcertData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    const getUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/get_role/${userId}`
        );
        setUserRole(response.data.role);
      } catch (error) {
        // Handle any errors that occurred during the request
        console.error("Error fetching user role:", error);
        // Optionally, you can set an error state and display an error message to the user
      }
    };

    fetchSinglePage();
    getUserRole();
  }, []);

  // Change event status
  async function changeEventStatus(status) {
    const updatedConcertData = concertData.map((concert) => {
      // Check if the status is "suggested"
      if (status === "suggested") {
        const typeArray = concert.type || [];

        // Check if "suggested" is already present in the type array
        const suggestedIndex = typeArray.indexOf("suggested");

        console.log(suggestedIndex);

        if (suggestedIndex === -1) {
          console.log("asd");
          // If "suggested" is not present, add it to the array
          return {
            ...concert,
            type: [...typeArray, "suggested"],
          };
        } else {
          // If "suggested" is already present, remove it from the array
          typeArray.splice(suggestedIndex, 1);
          return {
            ...concert,
            type: typeArray,
          };
        }
      } else {
        // If the status is not "suggested," update the is_promoted_event property
        return {
          ...concert,
          is_promoted_event: !concert.is_promoted_event,
        };
      }
    });

    setConcertData(updatedConcertData);
    setProperty(status);
  }

  useEffect(() => {
    // Update the data in database
    const updateConcertProperty = async () => {
      if (!concertData || !propertyChanged) return;
      let value;

      if (propertyChanged === "promoted") {
        value = concertData[0].is_promoted_event;
      } else {
        if (concertData[0].type.includes("suggested")) value = true;
        else value = false;
      }

      try {
        // Make the PUT request to update the concert properties
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/update_event/${id}/${propertyChanged}/${value}`
        );

        toast.success(response.data.message, toastSetup("top-right", 3000));
      } catch (error) {
        console.error(
          "Error updating concert:",
          error.response?.data || "Server Error"
        );
      }
    };

    updateConcertProperty();
  }, [concertData]);

  return (
    <div className="single-page-container">
      {concertData ? (
        <div>
          <div className="single-page-top">
            {userRole === "admin" ? (
              <div className="single-page-icons-wrapper">
                <div
                  onClick={() => {
                    changeEventStatus("promoted");
                  }}
                >
                  <img
                    className="concert-edit-icon"
                    src={
                      concertData[0].is_promoted_event
                        ? UnPromotedIcon
                        : PromotedIcon
                    }
                    alt="Promoted"
                  />
                </div>
                <div
                  onClick={() => {
                    changeEventStatus("suggested");
                  }}
                >
                  <img
                    className="concert-edit-icon"
                    src={
                      concertData[0].type.includes("suggested")
                        ? UnSuggestedIcon
                        : SuggestedIcon
                    }
                    alt="Promoted"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            <img
              src={`${process.env.REACT_APP_API_URL}/static/event-images/${concertData[0].poster.landscape}`}
              alt=""
            />
            <div className="cover-overlay"></div>
          </div>
          <Hero id={id} concertData={concertData} />
          <ThisWeek heading="Iz iste sekcije" type={concertData[0].type[0]} />
        </div>
      ) : (
        <div className="single-page-loader"></div>
      )}
    </div>
  );
};

export default SinglePage;
