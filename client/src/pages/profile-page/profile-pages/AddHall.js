import React from "react";
import InfoIcon from "../../../assets/ikonice/info.svg";
import { Tooltip } from "react-tooltip";

export const AddHall = () => {
  return (
    <div className="add-hall-container">
      <div className="row">
        <Tooltip
          style={{ borderRadius: "10px", backgroundColor: "#455cd9" }}
          anchorId="info-icon"
          place="bottom"
          variant="info"
          content={
            <div>
              Ovdje možete dodavati dvorane. Primjer jedne dvorane:
              <br />
              <br />
              Ime: Dvorana Uskoplje
              <br />
              Ime kategorije: Zona1
              <br />
              Tip ulaznice: Parter
              <br />
              Broj ulaznica: 200
              <br />
              Cijena ulaznice: 20KM
            </div>
          }
        />
        <img id="info-icon" src={InfoIcon} alt="Info" />
      </div>
      <div className="row">
        <input
          className="event-input"
          name="hallName"
          placeholder="Ime dvorane"
          type="text"
        />
        <input
          className="event-input"
          name="loermIpsum"
          placeholder="Lorem ipsum"
          type="text"
        />
      </div>
      <div className="row">
        <h6>Dodaj kategorije</h6>
      </div>
      <div className="hall-categories-container container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <input
              className="event-input"
              name="categoryName"
              placeholder="Ime kategorije"
              type="text"
            />
            <input
              className="event-input"
              name="ticketNum"
              placeholder="Broj ulaznica"
              type="text"
            />
          </div>
          <div className="col-lg-6 add-hall-right-col">
            <input
              className="event-input"
              name="ticketType"
              placeholder="Tip ulaznice"
              type="text"
            />
            <input
              className="event-input"
              name="loermIpsum"
              placeholder="Lorem ipsum"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
