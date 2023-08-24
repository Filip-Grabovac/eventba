import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "../../../assets/ikonice/arrow_icon.svg";
import { hrTimeFormatShort } from "../../../components/helper/timeFormatShort";
import axios from "axios";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";

export const VerifyEventsCard = ({ event }) => {
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [arrowDisabled, disableArrow] = useState(false);

  useEffect(() => {
    // Get the height of the dropdown content
    setDropdownHeight(dropdown ? dropdownRef.current.scrollHeight : 0);

    if (!dropdown) {
      setTimeout(() => {
        setBorderRadius(dropdown ? false : true);
      }, 200);
      return;
    }
    setBorderRadius(dropdown ? false : true);
  }, [dropdown]);

  function toggleDropdown(e) {
    setDropdown(!dropdown);

    // Disable arrow on 0.4 sec so user cannot spam
    disableArrow(true);
    setTimeout(() => {
      disableArrow(false);
    }, 400);
  }

  const handleVerify = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/verify_event`,
        { _id: event._id }
      );
      toast.success(
        "Uspješno verificiran događaj!",
        toastSetup("top-center", 3000)
      );
    } catch (error) {
      toast.error(
        `Greška pri verfikaciji događaja`,
        toastSetup("top-center", 3000)
      );
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/delete`,
        { _id: event._id }
      );
      toast.success(
        "Uspješno obrisan događaj!",
        toastSetup("top-center", 3000)
      );
    } catch (error) {
      toast.error(
        `Greška pri brisanju događaja`,
        toastSetup("top-center", 3000)
      );
    }
  };

  return (
    <div>
      <div
        style={{
          borderBottomLeftRadius: hasBorderRadius ? "7px" : "0",
          borderBottomRightRadius: hasBorderRadius ? "7px" : "0",
          marginBottom: dropdown ? dropdownHeight + 10 : "10px",
        }}
        className="mytickets-card"
      >
        <img
          style={{ borderBottomLeftRadius: hasBorderRadius ? "7px" : "0" }}
          src={`${process.env.REACT_APP_API_URL}/static/event-images/${event.poster.landscape}`}
          alt=""
        />
        <div className="mytickets-card-part">
          <div>
            <h5>{event.performer_name}</h5>
            <p>
              {new Date(event.time_of_event).toLocaleDateString(
                "hr-HR",
                hrTimeFormatShort
              )}
            </p>
          </div>
        </div>
        <div className="mytickets-card-part">
          <div>
            <p>
              {event.place.place}, {event.place.city}, {event.place.country}
            </p>
          </div>
        </div>
        <div
          className="mytickets-card-part"
          onClick={(e) => (!arrowDisabled ? toggleDropdown(e) : undefined)}
          style={{
            borderBottomRightRadius: hasBorderRadius ? "7px" : "0",
            backgroundColor: hasBorderRadius
              ? "rgba(69, 91, 217, 0.7)"
              : "rgba(69, 91, 217, 0.5)",
          }}
        >
          <img
            style={dropdown ? { rotate: "-180deg" } : { rotate: "0deg" }}
            src={ArrowIcon}
            alt="Drop"
          />
        </div>
        <div
          style={{ maxHeight: dropdown ? dropdownHeight : 0 }}
          className="mytickets-card-dropdown"
          ref={dropdownRef}
        >
          <div className="verify-event-wrapper">
            <img
              src={`${process.env.REACT_APP_API_URL}/static/event-images/1691680588365_908_landscape.jpg`}
              alt=""
              className="verify-event-wrapper-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
