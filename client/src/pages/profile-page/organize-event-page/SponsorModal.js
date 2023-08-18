import React from "react";

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

  console.log(sponsorNames);

  return (
    <div className="sponsor-modal">
      <div className="modal-content">
        <h6>Odaberi sponzore</h6>
        {existingSponsors.map((sponsor, i) => (
          <div key={i} className="sponsor-row">
            <span>{sponsor}</span>
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
