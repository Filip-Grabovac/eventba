import React, { useEffect, useState } from "react";
import InfoIcon from "../../../assets/ikonice/info.svg";
import LinkIcon from "../../../assets/ikonice/link_icon.svg";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { EntranceControllerCard } from "../EntranceControllerCard";

export const EntranceChecker = (props) => {
  const [entranceControllorAcc, setEntranceControllorAcc] = useState(
    props.entranceData.entranceController
  );
  const userId = useSelector((state) => state.userState.user);
  const toastSetup = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  // Handle form submit
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Gather all form data
    const formData = {
      event: e.target.elements.event.value,
      entrance_num: e.target.elements.entrance_num.value,
      name: e.target.elements.name.value,
      password: e.target.elements.password.value,
      organizer_id: userId,
    };

    // Check all form data
    if (
      formData.event !== "" &&
      formData.entrance_num !== "" &&
      formData.name !== "" &&
      formData.password !== "" &&
      formData.password.length >= 6
    ) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL +
            "/api/v1/entrance_controllers/add_entrance_checker",
          formData
        );
        setEntranceControllorAcc((acc) => [
          ...acc,
          {
            ...formData,
            _id: response.data.data._id,
          },
        ]);

        toast.success(response.data.message, toastSetup);

        document.querySelectorAll(".control-input").forEach((e) => {
          e.value = "";
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      let counter = 0;
      document.querySelectorAll(".control-input").forEach((e) => {
        if (e.value === "") {
          e.style = "outline: 2px solid #f4cd46;";
          counter++;
        }
      });

      if (counter > 0) {
        toast.warn("Molimo unesite sva polja", toastSetup);
      } else {
        toast.warn("Sifra mora biti duga minimalno 6 karaktera", toastSetup);
        document.querySelector(".control-password-input").style =
          "outline: 2px solid #f4cd46;";
      }
    }
  }

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
          handleFormSubmit(e);
        }}
      >
        <div className="row">
          <div className="col-lg-6">
            <input
              className="control-input"
              placeholder="Dodijeli događaj"
              type="text"
              name="event"
              onInput={(e) => {
                e.target.style = "outline: none;";
              }}
            />
            <input
              className="control-input"
              placeholder="Ime računa"
              type="text"
              name="name"
              onInput={(e) => {
                e.target.style = "outline: none;";
              }}
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
              }}
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
        <button>Dodaj račun</button>
      </form>
      {entranceControllorAcc[0] ? (
        <div>
          <div className="row">
            <h6>Kontrolori ulaza</h6>
          </div>
          <div className="row control-acc-row">
            {entranceControllorAcc.map((e, i) => {
              return <EntranceControllerCard key={i} e={e} i={i} />;
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
