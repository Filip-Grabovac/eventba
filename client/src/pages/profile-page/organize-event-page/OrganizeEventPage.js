import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// Images
import UploadImage from "../../../assets/images/uplad_img_placeholder.png";
import plus from "../../../assets/ikonice/plus_icon.svg";
import trashcan from "../../../assets/ikonice/trash_can.svg";
// Components
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";
import { OrganizeEventCategories } from "./OrganizeEventCategories";
import SponsorModal from "./SponsorModal";
import { Theater } from "./Theater";
import { AddOrganizer } from "./AddOrganizer";
import { Editor } from "@tinymce/tinymce-react";
import tinyMCEConfig from "../../../components/helper/tinyConfig";
import { setLoginIsOpen } from "../../../store/loginSlice";

export const OrganizeEventPage = () => {
  const [selectedValue, setSelectedValue] = useState("");

  const [selectedImagesForUpload, setImages] = useState([]);
  const [description, setDescription] = useState("");

  const [concertHalls, setConcertHalls] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [zones, setZones] = useState([]);
  const [ticketInputs, setTicketInputs] = useState([]);
  const [placeData, setPlaceData] = useState({});
  const [cities, setCities] = useState();
  const [cityInputValue, setCityInputValue] = useState("");
  const userId = useSelector((state) => state.userState.user);
  const token = useSelector((state) => state.userState.token);
  const [organizer, setOrganizer] = useState(userId);
  const [rows, setRows] = useState({});
  const [profileData, setProfileData] = useState({});
  const [groundPlan, setGroundPlan] = useState();
  const [selectedImages, setSelectedImages] = useState([
    UploadImage,
    UploadImage,
  ]);
  const [existingSponsors, setExistingSponsors] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [sponsorNames, setSponsorNames] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  useEffect(() => {
    fetchSponsors();
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/id/${userId}`
      );
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Fetch halls with the city name
  useEffect(() => {
    if (cityInputValue === "") {
      setConcertHalls([]);
      return;
    }
    axios
      .get(
        process.env.REACT_APP_API_URL +
          `/api/v1/places/place_by_location/${cityInputValue}`
      )
      .then((response) => {
        setConcertHalls(response.data.placeNames);

        // Clear places UI if no matching halls
        if (response.data.placeNames[0] === undefined) setSelectedPlace("");
      })
      .catch((error) => {
        console.error("Error fetching concert halls:", error);
      });
  }, [cityInputValue]);

  const fetchSponsors = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/helper/sponsors`
      );
      setExistingSponsors(response.data);
    } catch (error) {
      toast.error(
        "Greška pri dohvatanju sponzora",
        toastSetup("top-right", 3000)
      );
    }
  };

  // Get zones after hall select
  const handlePlaceChange = async (e) => {
    const selectedHall = e.target.value;
    setSelectedPlace(selectedHall);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/places/zones`,
        {
          params: { selectedHall },
        }
      );

      const zonesData = response.data.zones;

      const zonesArray = Object.keys(zonesData).map((zoneName) => ({
        name: zoneName,
        amount: zonesData[zoneName].amount,
        type: zonesData[zoneName].type,
        price: zonesData[zoneName].price,
      }));
      setZones(zonesArray);
      setTicketInputs(zonesArray);

      setPlaceData(response.data);
      if (response.data.type === "theater") setRows(response.data.zones);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const renderConcertHallOptions = () => {
    if (!Array.isArray(concertHalls)) {
      return null; // or return an appropriate fallback if concertHalls is not an array
    }

    return concertHalls.map((hall, i) => (
      <option key={i} value={hall}>
        {hall}
      </option>
    ));
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleImageClick = (index, aspectRatio) => () => {
    const input = document.createElement("input");
    input.classList.add("portrait-img");
    input.type = "file";
    input.accept = "image/jpeg, image/png"; // Only accept JPG and PNG images

    input.onchange = async (e) => {
      const file = e.target.files[0];

      // Validate file type
      if (
        !file.type.startsWith("image/") ||
        (file.type !== "image/jpeg" && file.type !== "image/png")
      ) {
        toast.warn(
          "Molimo dodajte sliku u JPG ili PNG formatu.",
          toastSetup("top-right", 3000)
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = async (upload) => {
        const newImage = upload.target.result;

        const imageElement = document.createElement("img");
        imageElement.onload = async () => {
          const width = imageElement.width;
          const height = imageElement.height;

          const imageAspectRatio = width / height;

          // Check aspect ratio
          if (
            Math.abs(imageAspectRatio - aspectRatio) < 0.15 ||
            Math.abs(imageAspectRatio - 1 / aspectRatio) < 0.15
          ) {
            // Remove outline if user set image
            if (index === 0)
              document.querySelector(".portrait-wrapper").style =
                "outline: none";
            else
              document.querySelector(".landscape-wrapper").style =
                "outline: none";

            setSelectedImages((prevImages) => {
              const updatedImages = [...prevImages];
              updatedImages[index] = newImage;
              return updatedImages;
            });

            setImages((prevImages) => {
              const updatedFiles = [...prevImages];
              updatedFiles[index] = file;
              return updatedFiles;
            });
          } else {
            toast.warn(
              `Molimo dodajte sliku s ${
                aspectRatio === 2 / 3 ? "2:3" : "16:9"
              } formatom.`,
              toastSetup("top-right", 3000)
            );

            // Remove the selected image from the file input
            input.value = null;
          }
        };

        imageElement.src = newImage;
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    // Map event type

    const event = {
      performer_name: form.get("performerName"),
      poster: {
        landscape: "",
        portrait: "",
      },
      verified: false,
      tickets: {
        online_sale: {
          total_amount_left: 0,
          zones: {},
          sold_amount: 0,
          amount_inBAM: 0,
        },
        free_sale: {
          total_amoun_left: 0,
          amount_inBAM: 0,
          total_loaned: 0,
          sold_amount: 0,
          zones: {},
        },
      },
      tickets_yesterday: {
        online_sale: {
          total_amount_left: 0,
          zones: {},
          sold_amount: 0,
          amount_inBAM: 0,
        },
        free_sale: {
          total_amount_left: 0,
          amount_inBAM: 0,
          total_loaned: 0,
          sold_amount: 0,
          zones: {},
        },
      },
      sponsors: sponsorNames,
      time_of_event: form.get("timeOfEvent"),
      place: {
        country: form.get("country"),
        city: form.get("city"),
        place: form.get("place"),
        type: placeData.type,
        ground_plan: "",
      },
      type: form.get("eventType"),
      is_promoted_event: false,
      description: description,
      organizer: organizer,
    };
    if (placeData.type === "hall")
      ticketInputs.forEach((ticket) => {
        const categoryKey = ticket.name;
        event.tickets.online_sale.zones[categoryKey] = {
          amount: Number(ticket.amount),
          max_amount: Number(ticket.amount),
          price: Number(ticket.price),
          name: ticket.type,
        };
        event.tickets_yesterday.online_sale.zones[categoryKey] = {
          amount: Number(ticket.amount),
          max_amount: Number(ticket.amount),
          price: Number(ticket.price),
          name: ticket.type,
        };

        event.tickets.online_sale.total_amount_left += parseInt(ticket.amount);
        event.tickets_yesterday.online_sale.total_amount_left += parseInt(
          ticket.amount
        );
      });
    if (placeData.type === "theater") {
      event.tickets.online_sale.zones = rows;
      event.tickets_yesterday.online_sale.zones = rows;
      event.place.ground_plan = groundPlan;
      event.tickets.online_sale.total_amount_left = 0; //
      event.tickets_yesterday.online_sale.total_amount_left = 0; //
      Object.entries(rows).forEach(([key, value]) => {
        event.tickets.online_sale.total_amount_left += parseInt(
          value.max_amount || 0 // Use max_amount if available, or 0 if not
        );
      });
      event.tickets_yesterday.online_sale.total_amount_left =
        event.tickets.online_sale.total_amount_left;
    }

    // Check if everything is valid(all fields + images)
    if (
      !selectedImages[0].includes("uplad_img_placeholder") &&
      !selectedImages[1].includes("uplad_img_placeholder") &&
      event.performer_name &&
      event.type &&
      event.place.country &&
      event.place.city &&
      event.place.place &&
      event.time_of_event &&
      event.description
    ) {
      // Generate unique names for the uploaded files
      const uniqueNames = selectedImagesForUpload.map((_, index) => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        const extension = ".jpg";
        const suffix = index === 0 ? "_portrait" : "_landscape";
        return `${timestamp}_${randomNum}${suffix}${extension}`;
      });

      // Create an array to store the updated selected images with unique names
      const updatedSelectedImages = selectedImages.map((image, index) => {
        return image.includes("uplad_img_placeholder")
          ? image
          : uniqueNames[index];
      });

      // Add event with updated selected images
      try {
        const updatedEvent = {
          ...event,
          poster: {
            landscape: updatedSelectedImages[1],
            portrait: updatedSelectedImages[0],
          },
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/create_event`,
          { event: updatedEvent, token },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // UPLOAD IMAGES
        const formData = new FormData();

        for (let i = 0; i < sponsors.length; i++) {
          formData.append("firstFiles", sponsors[i], sponsors[i].name);
        }

        for (let i = 0; i < selectedImagesForUpload.length; i++) {
          formData.append(
            "secondFiles",
            selectedImagesForUpload[i],
            uniqueNames[i]
          );
        }

        // Send formData to the backend

        const response2 = await axios.post(
          process.env.REACT_APP_API_URL + "/api/v1/concerts/upload_img",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success(
          `${response.data.message} ${response2.data.message}`,
          toastSetup("top-center", 3000)
        );
      } catch (error) {
        // Handle any errors
        if (error.response.status === 401) {
          dispatch(setLoginIsOpen(true));
        }
        toast.error(
          `Došlo je do pogreške prilikom dodavanja događaja. ${error.response.data.message}!`,
          toastSetup("top-center", 3000)
        );
      }
    } else {
      // Check which fields are empty
      document.querySelectorAll(".event-input").forEach((e) => {
        if (e.value === "") {
          e.style = "outline: 2px solid #f4cd46;";
        }
      });

      // CHECK IMAGES
      // First image
      if (selectedImages[0].includes("uplad_img_placeholder"))
        document.querySelector(".portrait-wrapper").style =
          "outline: 2px solid #f4cd46;";
      else document.querySelector(".portrait-wrapper").style = "outline: none";

      // Second image
      if (selectedImages[1].includes("uplad_img_placeholder"))
        document.querySelector(".landscape-wrapper").style =
          "outline: 2px solid #f4cd46;";
      else document.querySelector(".landscape-wrapper").style = "outline: none";

      // Check if textarea.length > 300
      // if (description.value.length > 500) {
      //   toast.warn(
      //     `Opis događaja ne smije sadržavati više od 500 znakova`,
      //     toastSetup("top-right", 3000)
      //   );
      // }

      toast.warn(
        `Molimo popunite sva polja i dodajte obje slike`,
        toastSetup("top-right", 3000)
      );
    }
  }

  // Get cities in input
  async function getCities(e) {
    const cityName = e.target.value;

    // Fetch cities by city name
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/api/v1/places/city_name/${cityName}`
      );
      setCities(response.data.city);
    } catch (error) {
      // If input is empty close dropdown
      if (cityName === "") {
        document.querySelector(".all-cities").style =
          "visibility: hidden; opacity: 0;";
        setCities();

        // Clear places UI if input is empty = no halls
        setSelectedPlace("");
        return;
      } else {
        setCities([error.response.data.msg]);
      }
    }

    // If there is value open the dropdown
    document.querySelector(".all-cities").style =
      "visibility: visible; opacity: 1;";
  }

  // Update ticketInputs when zones changes
  useEffect(() => {
    // Populate ticketInputs with data from zones if they are not already set
    if (zones.length > 0 && ticketInputs.length === 0) {
      const initialTicketInputs = zones.map((zone) => ({
        name: zone.name ? zone.name : "",
        amount: zone.amount ? zone.amount : "",
        type: zone.type ? zone.type : "",
        price: zone.price ? zone.price : "",
      }));
      setTicketInputs(initialTicketInputs);
    }
  }, [zones, ticketInputs.length]);

  // After selecting the hall, render the inputs
  const renderTicketInputs = (zones) => {
    if (placeData.type !== "hall") {
      return null;
    }
    return zones.map((zone, index) => {
      const ticketInput = ticketInputs[index] || {};

      const {
        name: inputName,
        type: inputType,
        amount: inputAmount,
        price: inputPrice,
      } = ticketInput;

      return (
        <div className="event-categories-container">
          <OrganizeEventCategories
            key={zone.name}
            index={index}
            inputType={inputType}
            inputName={inputName}
            zoneName={zone.name}
            inputAmount={inputAmount}
            zoneTicket={zone.ticket}
            inputPrice={inputPrice}
            ticketInputs={ticketInputs}
            setTicketInputs={setTicketInputs}
          />
          <div className="trashcan" onClick={() => handleRemoveCategory(index)}>
            <img src={trashcan} />
          </div>
        </div>
      );
    });
  };
  const handleAddCategory = () => {
    setZones((prevZones) => [
      ...prevZones,
      { name: "", amount: "", type: "", price: "" },
    ]);
  };

  const handleRemoveCategory = (index) => {
    const updatedTicketInputs = [...ticketInputs];
    updatedTicketInputs.splice(index, 1);
    setTicketInputs(updatedTicketInputs);

    const updatedZones = [...zones];
    updatedZones.splice(index, 1);
    setZones(updatedZones);
  };

  return (
    <form
      className="form container organize-form smaller-profile"
      onSubmit={handleSubmit}
    >
      <div className="organize-top-part">
        <div>
          <h3>
            Portretna slika <span>(2:3)</span>
          </h3>
        </div>
        <div>
          <h3>
            Pejzažna slika <span>(16:9)</span>
          </h3>
        </div>
        <div className="images-wrapper">
          <div className="portrait-wrapper">
            <img
              className={`${
                !selectedImages[0].includes("uplad_img_placeholder")
                  ? "uploaded-event-image"
                  : ""
              }`}
              src={selectedImages[0]}
              alt="Upload"
              onClick={handleImageClick(0, 2 / 3)}
            />
          </div>
          <div className="landscape-wrapper">
            <img
              className={`${
                !selectedImages[1].includes("uplad_img_placeholder")
                  ? "uploaded-event-image"
                  : ""
              }`}
              src={selectedImages[1]}
              alt="Upload"
              onClick={handleImageClick(1, 16 / 9)}
            />
          </div>
        </div>
      </div>

      {profileData.role === "admin" && (
        <div className="organize-middle-part">
          <AddOrganizer setOrganizer={setOrganizer} organizer={organizer} />
        </div>
      )}

      <div className="organize-middle-part">
        <div>
          <input
            className="event-input"
            name="performerName"
            placeholder="Ime izvođača"
            min={3}
            maxLength={25}
            type="text"
            onInput={(e) => {
              e.target.style = "outline: none;";
            }}
          />
        </div>
        <div className="select-div">
          <select
            name="eventType"
            value={selectedValue}
            onChange={handleSelectChange}
            className="event-input"
            onChangeCapture={(e) => {
              e.target.style = "outline: none;";
            }}
          >
            <option value="" disabled hidden>
              Odaberi tip događaja
            </option>
            <option value="concert">Koncert</option>
            <option value="festival">Festival</option>
            <option value="theaters">Predstave</option>
            <option value="sport">Sport</option>
            <option value="other">Ostalo</option>
          </select>
        </div>
      </div>
      <div className="organize-middle-part time-sponsors">
        <div>
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
        <div className="select-div">
          <input
            name="timeOfEvent"
            className="profile-date-input event-input"
            placeholder="Vrijeme izvođenja"
            type="datetime-local"
            onInput={(e) => {
              e.target.style = "outline: none;";
            }}
          />
        </div>
      </div>
      <div className="organize-middle-part">
        <div>
          <div>
            <input
              name="country"
              type="text"
              className="location-input event-input"
              placeholder="Država"
              onInput={(e) => {
                e.target.style = "outline: none;";
              }}
            />
          </div>
          <div>
            <input
              name="city"
              type="text"
              className="location-input event-input"
              placeholder="Grad"
              autoComplete="off"
              value={cityInputValue}
              onInput={(e) => {
                setCityInputValue(e.target.value);
                e.target.style = "outline: none;";
                getCities(e);
              }}
            />
            <div className="all-cities">
              <ul>
                {cities &&
                  cities.map((e, i) => {
                    return (
                      <li
                        className={e.includes("ne nalazi") ? "city-error" : ""}
                        key={i}
                      >
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            setCityInputValue(e.target.textContent);
                            document.querySelector(".all-cities").style =
                              "visibility: hidden; opacity: 0;";
                          }}
                          href="#"
                        >
                          {e}
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div>
            <select
              name="place"
              type="text"
              className="location-input event-input"
              value={selectedPlace}
              onChange={handlePlaceChange}
              onChangeCapture={(e) => {
                e.target.style = "outline: none;";
              }}
            >
              <option className="place-option" value="" disabled hidden>
                Mjesto
              </option>
              {concertHalls[0] === undefined ? (
                <option disabled>Ne postoji mjesto u tom gradu</option>
              ) : (
                ""
              )}
              {renderConcertHallOptions()}
            </select>
          </div>
        </div>
      </div>

      {placeData && placeData.type === "hall" && (
        <>
          <h6>Online ulaznice</h6>
          <div className="preset-category">
            <p>Naziv zone</p>
            <p>Tip ulaznice</p>
            <p>Broj ulaznica</p>
            <p>Cijena ulaznice</p>
          </div>
          {renderTicketInputs(zones)}
          <div className="plus-icon" onClick={() => handleAddCategory()}>
            <img src={plus} alt="Add" />
          </div>
        </>
      )}
      {placeData && placeData.type === "theater" && (
        <>
          <h6>Online ulaznice</h6>
          <Theater
            placeData={placeData}
            setRows={setRows}
            rows={rows}
            setGroundPlan={setGroundPlan}
          />
        </>
      )}
      <div className="organize-bottom-part">
        <h6 style={{ marginTop: "70px" }}>Opis događaja</h6>
        <Editor
          apiKey={tinyMCEConfig.apiKey}
          value={description}
          init={tinyMCEConfig}
          onEditorChange={(content) => setDescription(content)}
        />
      </div>
      <div className="row">
        <button type="submit">Dodaj događaj</button>
      </div>
    </form>
  );
};
