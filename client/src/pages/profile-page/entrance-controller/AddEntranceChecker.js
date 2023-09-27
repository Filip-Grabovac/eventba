import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// Images
import InfoIcon from "../../../assets/ikonice/info.svg";
import LinkIcon from "../../../assets/ikonice/link_icon.svg";
// Components
import { Tooltip } from "react-tooltip";
import { EntranceControllerCard } from "./EntranceControllerCard";
import { AddControllerFunction } from "./AddControllerFunction";
import { UpdateControllerFunction } from "./UpdateControllerFunction";

import sortByTime from "../../../functions/sortByTimeOfEvent";
import filterByTime from "../../../functions/filterByTime";

export const EntranceChecker = ({ organizerEvents, entranceData }) => {
  const [entranceControllorAcc, setEntranceControllorAcc] = useState(
    entranceData.entranceController
  );
  const [updateData, setUpdateData] = useState();
  const [buttonContent, setButtonContent] = useState("Dodaj račun");
  const [selectedValue, setSelectedValue] = useState("");
  const [entranceNum, setEntranceNum] = useState("");
  const [controllerName, setControllerName] = useState("");
  const userId = useSelector((state) => state.userState.user);

  // Add controller and update UI
  async function handleFormSubmit(e) {
    e.preventDefault();

    AddControllerFunction(
      e,
      userId,
      setEntranceControllorAcc,
      setSelectedValue,
      setControllerName,
      setEntranceNum
    );
  }

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // Update controller
  async function updateController(e) {
    e.preventDefault();

    UpdateControllerFunction(
      e,
      userId,
      setSelectedValue,
      updateData,
      setUpdateData,
      entranceControllorAcc,
      setButtonContent
    );
  }

  // Controller input
  function handleInputChange(e, property, setValue) {
    const newValue = e.target.value;
    if (!updateData) {
      setValue(newValue); // This sets the value for regular text inputs
    } else {
      setUpdateData((prevData) => ({
        ...prevData,
        [property]: newValue, // This updates the corresponding property in updateData
      }));
    }
  }
  // Set event dropdown value if user clicks update
  useEffect(() => {
    if (updateData && selectedValue === "") {
      setSelectedValue(updateData.event);
    }
  }, [updateData]);

  const filteredEvents = sortByTime(filterByTime(organizerEvents));

  return (
    <div className="add-reseller-container container-fluid">
      <div className="row">
        <Tooltip
          style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
          anchorId="info-icon"
          place="bottom"
          variant="info"
          content="Ovdje možete dodavati račune za kontolore ulaza. Takav račun će imati QR code skener"
        />
        <Tooltip
          style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
          anchorId="scanner_link"
          place="bottom"
          variant="info"
          content="Kliknite ovdje da odete na prijavu kontrolora ulaza"
        />
        <img id="info-icon" src={InfoIcon} alt="Info" />
        <a
          target="_blank"
          id="scanner_link"
          className="link-icon"
          href="/controller_login"
        >
          <img src={LinkIcon} alt="Link" />
        </a>
      </div>
      <div className="row">
        <h6>Dodajte kontrolora ulaza</h6>
      </div>
      <form
        onSubmit={(e) => {
          !updateData ? handleFormSubmit(e) : updateController(e);
        }}
      >
        <div className="row">
          <div className="col-lg-6">
            <select
              className="organizer-events-select control-input"
              placeholder=""
              type="text"
              name="event"
              value={selectedValue}
              onChange={(e) => {
                e.target.style = "outline: none;";
                handleSelectChange(e);
              }}
            >
              <option value="" disabled hidden>
                Dodijeli događaj
              </option>
              {organizerEvents[0] !== undefined ? (
                filteredEvents.map((e, i) => {
                  // Convert the time_of_event string to a Date object
                  const eventDate = new Date(e.time_of_event);
                  return (
                    <option
                      data-id={e._id}
                      value={`${
                        e.performer_name
                      } - ${eventDate.toLocaleDateString("hr-HR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}`}
                      key={i}
                    >
                      {`${e.performer_name} - ${eventDate.toLocaleDateString(
                        "hr-HR",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}`}
                    </option>
                  );
                })
              ) : (
                <option disabled>Nemate organiziranih događaja</option>
              )}
            </select>

            <input
              className="control-input"
              placeholder="Ime računa"
              type="text"
              name="name"
              onInput={(e) => {
                e.target.style = "outline: none;";
                handleInputChange(e, "controller_name", setControllerName);
              }}
              value={updateData ? updateData.controller_name : controllerName}
            />
          </div>
          <div className="col-lg-6">
            <input
              className="control-input"
              placeholder="Broj ulaza"
              type="number"
              name="entrance_num"
              onInput={(e) => {
                e.target.style = "outline: none;";
                handleInputChange(e, "entrance_num", setEntranceNum);
              }}
              value={updateData ? updateData.entrance_num : entranceNum}
            />
            <input
              className="control-input control-password-input"
              placeholder="Lozinka računa"
              type="password"
              name="password"
              onInput={(e) => {
                e.target.style = "outline: none;";
              }}
            />
          </div>
        </div>
        <button>{buttonContent}</button>
      </form>
      {entranceControllorAcc[0] ? (
        <div>
          <div className="row">
            <h6>Kontrolori ulaza</h6>
          </div>
          <div className="row control-acc-row">
            {entranceControllorAcc.map((e, i) => {
              return (
                <EntranceControllerCard
                  key={i}
                  e={e}
                  i={i}
                  setUpdateData={setUpdateData}
                  setButtonContent={setButtonContent}
                />
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
