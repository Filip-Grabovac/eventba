import React, { useState } from "react";
import InfoIcon from "../../../assets/ikonice/info.svg";
import PlusIcon from "../../../assets/ikonice/plus_icon.svg";
import { Tooltip } from "react-tooltip";

export const AddHall = () => {
  const [rowNum, setRowNum] = useState(1);

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
      <form action="">
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
          {Array.from({ length: rowNum }).map((_, i) => {
            return (
              <div key={i} className="row">
                <div className="col-lg-6">
                  <input
                    className="event-input"
                    name="categoryName"
                    placeholder="Ime kategorije"
                    type="text"
                  />
                  <input
                    className="event-input"
                    name="ticketType"
                    placeholder="Tip ulaznice"
                    type="text"
                  />
                </div>
                <div className="col-lg-6 add-hall-right-col">
                  <input
                    className="event-input"
                    name="ticketsNum"
                    placeholder="Broj ulaznica"
                    type="text"
                  />
                  <input
                    className="event-input"
                    name="ticketPrice"
                    placeholder="Cijena ulaznice"
                    type="text"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <img
          onClick={() => {
            setRowNum((prevRowNum) => prevRowNum + 1);
          }}
          className="add-category-icon"
          src={PlusIcon}
          alt="Add"
        />
        <button className="add-hall-btn">Dodaj dvoranu</button>
      </form>
    </div>
  );
};
