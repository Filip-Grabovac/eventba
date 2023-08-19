import React from "react";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";

const SponsorModal = ({
  isOpen,
  existingSponsors,
  toggleModal,
  sponsors,
  setSponsors,
  setSponsorNames,
  sponsorNames,
}) => {
  // Event handler for file selection
  const handleFileSelect = (event) => {
    const fileList = event.target.files;
    const selectedFiles = Array.from(fileList);

    // Regular expression to match disallowed characters
    const forbiddenCharsRegex = /[čžšćđ]/i; // Add other characters as needed

    // Check if any of the selected files' names contain disallowed characters
    const hasDisallowedChars = selectedFiles.some((file) =>
      forbiddenCharsRegex.test(file.name)
    );

    if (hasDisallowedChars) {
      toast.error(
        "Ime sponzora ne smije sadržavati slova s kvačicama!",
        toastSetup("top-center", 3000)
      );

      return;
    }

    // Check if any of the selected files already exist in the sponsors list
    const isFileExists = selectedFiles.some((file) =>
      sponsors.some((sponsor) => sponsor.name === file.name)
    );

    if (!isFileExists) {
      setSponsors((prevSponsors) => [...prevSponsors, ...selectedFiles]);
      setSponsorNames((prevNames) => [
        ...prevNames,
        ...selectedFiles.map((file) => file.name),
      ]);
    }
  };

  const handleCheckboxChange = (sponsorName) => {
    setSponsorNames((prevSelectedNames) => {
      if (prevSelectedNames.includes(sponsorName)) {
        return prevSelectedNames.filter((name) => name !== sponsorName);
      } else {
        return [...prevSelectedNames, sponsorName];
      }
    });
  };
  if (!isOpen) {
    return null;
  }

  return (
    <div className="sponsor-modal">
      <div className="modal-content">
        <h6>Odaberi sponzore</h6>
        <div className="sponsors-wrapper">
          {existingSponsors.map((sponsor, i) => (
            <div key={i} className="sponsor-row">
              <span>{sponsor.split(".")[0]}</span>
              <img
                src={`${process.env.REACT_APP_API_URL}/static/sponsors/${sponsor}`}
                alt={`Sponsor image ${sponsor}`}
              />
              <label key={i}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(sponsor)}
                  checked={sponsorNames.includes(sponsor)}
                />
                {sponsor.name}
              </label>
            </div>
          ))}
        </div>
        <input
          name="sponsors"
          id="sponsors"
          className="custom-file-input event-input"
          type="file"
          onChange={handleFileSelect}
          accept="image/*"
        />
        <button className="modal-btn-close" onClick={toggleModal}>
          Zatvori
        </button>
      </div>
    </div>
  );
};

export default SponsorModal;
