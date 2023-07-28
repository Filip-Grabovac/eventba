import React, { useEffect, useState } from "react";
import axios from "axios";
// Images
import InfoIcon from "../../../assets/ikonice/info.svg";
import PlusIcon from "../../../assets/ikonice/plus_icon.svg";
// Components
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";
import bosnianCities from "../../../components/helper/bosnianCities";

export const AddHall = () => {
  const [rowNum, setRowNum] = useState(1);
  //Dropdown forcity input
  const [selectedCity, setSelectedCity] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [filteredCities, setFilteredCities] = useState([]);

  // Update the filtered cities based on the user input
  useEffect(() => {
    const filtered = bosnianCities.filter((city) =>
      city.toLowerCase().includes(selectedCity.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [selectedCity]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowDropdown(false);
  };

  // Submit form
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Get all data
    let counter = 0;
    const allTicketTypes = document.querySelectorAll(".ticket-type");
    const ticketsNum = document.querySelectorAll(".tickets-num");
    const allTicketPrices = document.querySelectorAll(".ticket-price");
    const formData = new FormData(e.target);

    const hallName = formData.get("hallName");
    const hallLocation = formData.get("hallLocation");
    const tickets = [];

    // Get all category info
    document.querySelectorAll(".category-name").forEach((e, i) => {
      tickets.push({
        name: e.value,
        ticket: {
          type: allTicketTypes[i].value,
          amount: ticketsNum[i].value,
          price: allTicketPrices[i].value,
        },
      });
    });

    try {
      // Structure data
      const hallData = {
        name: hallName,
        location: hallLocation,
        type: "hall",
        zones: tickets,
      };

      //Check if all data populated
      document.querySelectorAll(".event-input").forEach((e) => {
        if (e.value === "") {
          counter++;
          e.style = "outline: 2px solid #f4cd46;";
        }
      });

      // If there is an empty field return
      if (counter > 0) {
        toast.warn("Molimo unesite sva polja", toastSetup("top-right", 3000));
        return;
      }

      // Wait for all data to be populated before posting
      await axios.post(
        process.env.REACT_APP_API_URL + "/api/v1/places/add_place",
        hallData
      );

      // Clear all fields
      document.querySelectorAll(".event-input").forEach((e) => {
        e.value = "";
      });
      setRowNum(1);
      toast.success("Uspješno dodana dvorana", toastSetup("top-right", 3000));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="add-hall-container">
      <div className="row">
        <Tooltip
          style={{
            borderRadius: "10px",
            backgroundColor: "#455cd9",
            zIndex: "3",
          }}
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
      <form
        onSubmit={(e) => {
          handleFormSubmit(e);
        }}
      >
        <div className="row place-input">
          <input
            className="event-input"
            name="hallName"
            placeholder="Ime dvorane"
            type="text"
            onInput={(e) => {
              e.target.style = "outline: none;";
            }}
          />
          <input
            className="event-input "
            name="hallLocation"
            placeholder="Izaberi mjesto"
            type="text"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 500)}
          />
          {showDropdown && (
            <div className="dropdown">
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </div>
                ))
              ) : (
                <div className="dropdown-item">No results</div>
              )}
            </div>
          )}
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
                    className="event-input category-name"
                    name="categoryName"
                    placeholder="Ime kategorije"
                    type="text"
                    onInput={(e) => {
                      e.target.style = "outline: none;";
                    }}
                  />
                  <input
                    className="event-input ticket-type"
                    name="ticketType"
                    placeholder="Tip ulaznice"
                    type="text"
                    onInput={(e) => {
                      e.target.style = "outline: none;";
                    }}
                  />
                </div>
                <div className="col-lg-6 add-hall-right-col">
                  <input
                    className="event-input tickets-num"
                    name="ticketsNum"
                    placeholder="Broj ulaznica"
                    type="text"
                    onInput={(e) => {
                      e.target.style = "outline: none;";
                    }}
                  />
                  <input
                    className="event-input ticket-price"
                    name="ticketPrice"
                    placeholder="Cijena ulaznice"
                    type="text"
                    onInput={(e) => {
                      e.target.style = "outline: none;";
                    }}
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
