import React, { useEffect, useState } from "react";
import { AddOrganizer } from "../organize-event-page/AddOrganizer";
import axios from "axios";
import SponsorModal from "../organize-event-page/SponsorModal";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";
import { Editor } from "@tinymce/tinymce-react";
import tinyMCEConfig from "../../../components/helper/tinyConfig";
import { useSelector } from "react-redux";

export const UpdateEventContainer = ({ concertData }) => {
  const [organizer, setOrganizer] = useState(concertData?.organizer);
  const userId = useSelector((state) => state.userState.user);

  useEffect(() => {
    setOrganizer(concertData.organizer);
  }, [concertData]);
  // Function to format date and time to CET (Central European Time)
  const formatDateToCET = (dateTimeString) => {
    const date = new Date(dateTimeString);

    // Check if daylight saving time (DST) is in effect (between the last Sunday in March and the last Sunday in October)
    const lastSundayInMarch = new Date(
      date.getFullYear(),
      2,
      31 - ((date.getDay() + 5) % 7)
    ); // March has index 2
    const lastSundayInOctober = new Date(
      date.getFullYear(),
      9,
      31 - ((date.getDay() + 5) % 7)
    ); // October has index 9
    const isDST = date > lastSundayInMarch && date < lastSundayInOctober;

    // Set the offset based on whether it's DST or not
    const ceeOffsetMinutes = isDST ? 120 : 60; // CET is UTC+1 in winter and UTC+2 in summer
    date.setMinutes(date.getMinutes() + ceeOffsetMinutes);

    return date.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:MM"
  };

  // Convert the initial time value to CET format
  const initialTimeValue = formatDateToCET(concertData?.time_of_event);
  const [editedConcertData, setEditedConcertData] = useState({
    ...concertData,
    time_of_event: initialTimeValue,
  });

  useEffect(() => {
    setEditedConcertData({
      ...concertData,
      time_of_event: initialTimeValue,
    });
  }, [concertData, initialTimeValue]);

  const [existingSponsors, setExistingSponsors] = useState([]);

  const [sponsors, setSponsors] = useState([]);
  const [sponsorNames, setSponsorNames] = useState(concertData?.sponsors);
  const [isModalOpen, setModalOpen] = useState(false);

  // Initialize state to hold the edited data, including "time_of_event"

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // Handle changes to form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // If the field is "time_of_event," no need to change the format
    if (name === "time_of_event") {
      setEditedConcertData({
        ...editedConcertData,
        [name]: value,
      });
    } else if (name.startsWith("place.")) {
      const placeField = name.split(".")[1];
      setEditedConcertData({
        ...editedConcertData,
        place: {
          ...editedConcertData.place,
          [placeField]: value,
        },
      });
    } else if (name === "type") {
      const types = value.split(",").map((type) => type.trim());
      setEditedConcertData({
        ...editedConcertData,
        type: types,
      });
    } else {
      // For other fields, update as usual
      setEditedConcertData({
        ...editedConcertData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/helper/sponsors`
      );
      setExistingSponsors(response.data);
    } catch (error) {}
  };

  function getChangedAttributes(originalData, editedData) {
    const changedAttributes = {};

    for (const key in editedData) {
      if (originalData[key] !== editedData[key]) {
        changedAttributes[key] = editedData[key];
      }
    }

    return changedAttributes;
  }

  const changedAttributes = getChangedAttributes(
    concertData,
    editedConcertData
  );

  const id = concertData._id;
  // Handle form submission (update the database)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/v1/concerts/update_event",
        {
          id,
          data: {
            ...changedAttributes,
            sponsors: sponsorNames,
            organizer: organizer,
          },
          userId,
        }
      );
      toast.success(response.data.message, toastSetup("bottom-center", 1500));
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message, toastSetup("top-center", 3000));
    }
  };

  return (
    concertData && (
      <div>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              id="performer_name"
              name="performer_name"
              value={editedConcertData.performer_name}
              onChange={handleInputChange}
            />
            <input
              type="datetime-local"
              id="time_of_event"
              name="time_of_event"
              value={editedConcertData.time_of_event}
              onChange={handleInputChange}
            />{" "}
          </div>
          <div className="input-row">
            <AddOrganizer setOrganizer={setOrganizer} organizer={organizer} />
            <select
              name="type"
              value={
                editedConcertData.type[0] !== "suggested"
                  ? editedConcertData.type[0]
                  : editedConcertData.type[1]
              }
              onChange={handleInputChange}
              className="event-input"
            >
              <option value="concert">Koncert</option>
              <option value="festival">Festival</option>
              <option value="theaters">Predstava</option>
              <option value="sport">Sport</option>
              <option value="other">Ostalo</option>
            </select>
          </div>

          <div className="city">
            <input
              className="one"
              type="text"
              id="place.country"
              name="place.country"
              value={editedConcertData.place.country}
              onChange={handleInputChange}
            />

            <input
              className="two"
              type="text"
              id="place.city"
              name="place.city"
              value={editedConcertData.place.city}
              onChange={handleInputChange}
            />

            <input
              className="three"
              type="text"
              id="place.place"
              name="place.place"
              value={editedConcertData.place.place}
              onChange={handleInputChange}
            />
          </div>
          <div className="sponsor-row">
            <button type="button" className="sponsor-btn" onClick={toggleModal}>
              Odaberi sponzore
            </button>
            <ul className="sponsors-ul">
              {sponsorNames[0] !== undefined ? (
                sponsorNames.map((e, i) => {
                  return <li key={i}>{e.split(".")[0]}</li>;
                })
              ) : (
                <li className="not-selected-sponsor">
                  Sponzori nisu odabrani <span>*</span>
                </li>
              )}
            </ul>
          </div>
          <SponsorModal
            sponsors={sponsors}
            setSponsors={setSponsors}
            isOpen={isModalOpen}
            existingSponsors={existingSponsors}
            toggleModal={toggleModal}
            setSponsorNames={setSponsorNames}
            sponsorNames={sponsorNames}
          />
          <div className="description-wrapper">
            <h6>Opis događaja</h6>
            <Editor
              apiKey={tinyMCEConfig.apiKey}
              value={String(editedConcertData.description || "")}
              init={tinyMCEConfig}
              onEditorChange={(content) =>
                setEditedConcertData({
                  ...editedConcertData,
                  description: content,
                })
              }
            />
          </div>
          <button type="submit">Uredi događaj</button>
        </form>
      </div>
    )
  );
};
