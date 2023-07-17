import React, { useEffect, useState } from "react";
import UploadImage from "../../../assets/images/uplad_img_placeholder.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

export const OrganizeEventPage = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [textareaLimit, setTextareaLimit] = useState("0");
  const [selectedImages, setSelectedImages] = useState([
    UploadImage,
    UploadImage,
  ]);
  const [selectedImagesForUpload, setImages] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [sponsorNames, setSponsorNames] = useState([]);
  const [concertHalls, setConcertHalls] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [zones, setZones] = useState([]);
  const [ticketInputs, setTicketInputs] = useState([]);
  const [typeOfPlace, setTypeOfPlace] = useState("");

  const userId = useSelector((state) => state.userState.user);

  const toastSetup = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  // Fetch halls
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/api/v1/places") // Replace with your API endpoint for fetching concert halls
      .then((response) => {
        setConcertHalls(response.data.places);
      })
      .catch((error) => {
        console.error("Error fetching concert halls:", error);
      });
  }, []);

  const handlePlaceChange = (e) => {
    const selectedHall = e.target.value;
    setSelectedPlace(selectedHall);

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/v1/places/zones`, {
        params: { selectedHall: selectedHall }, // Pass the selected hall via query parameter
      })
      .then((response) => {
        setZones(response.data.zones);
        setTypeOfPlace(response.data.type);
      })
      .catch((error) => {
        console.error("Error fetching zones:", error);
      });
  };

  const handleTicketInputChange = (index, field, value) => {
    const updatedInputs = [...ticketInputs];

    // Check if the ticket input at the specified index exists
    if (!updatedInputs[index]) {
      // If it doesn't exist, initialize it with an empty object
      updatedInputs[index] = {};
    }

    // Update the specified field of the ticket input
    updatedInputs[index][field] = value;
    setTicketInputs(updatedInputs);
  };

  const renderConcertHallOptions = () => {
    if (!Array.isArray(concertHalls)) {
      return null; // or return an appropriate fallback if concertHalls is not an array
    }

    return concertHalls.map((hall) => (
      <option key={hall._id} value={hall.name}>
        {hall.name}
      </option>
    ));
  };
  const renderTicketInputs = () => {
    if (typeOfPlace !== "hall") {
      return null;
    }

    return zones.map((zone, index) => (
      <div className="organize-middle-part" style={{ gap: "20px" }} key={index}>
        <input
          name={`ticketName-${index}`}
          type="text"
          className="location-input event-input"
          placeholder={`Naziv ulaznice ${zone.name}`}
          value={ticketInputs[index]?.name || ""}
          onChange={(e) =>
            handleTicketInputChange(index, "name", e.target.value)
          }
        />
        <input
          name={`ticketAmount-${index}`}
          type="number"
          min="0"
          className="location-input event-input"
          placeholder={`Ukupan broj ulaznica ${zone.name}`}
          value={ticketInputs[index]?.amount || ""}
          onChange={(e) =>
            handleTicketInputChange(index, "amount", e.target.value)
          }
        />
        <input
          name={`ticketPrice-${index}`}
          type="number"
          min="0"
          step="0.01"
          className="location-input event-input"
          placeholder={`Cijena ${zone.name} ulaznice`}
          value={ticketInputs[index]?.price || ""}
          onChange={(e) =>
            handleTicketInputChange(index, "price", e.target.value)
          }
        />
      </div>
    ));
  };
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleImageClick = (index, aspectRatio) => () => {
    const input = document.createElement("input");
    input.classList.add("portrait-img");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (upload) => {
        const newImage = upload.target.result;

        const imageElement = document.createElement("img");
        imageElement.onload = async () => {
          const width = imageElement.width;
          const height = imageElement.height;

          const imageAspectRatio = width / height;

          // Set 0.05 for both 4:5 and 16:9
          if (Math.abs(imageAspectRatio - aspectRatio) < 0.2) {
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
              toastSetup
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
    const eventType = form.get("eventType");
    let mappedEventType;

    switch (eventType) {
      case "Koncert":
        mappedEventType = ["concert"];
        break;
      case "Pozorište":
        mappedEventType = ["theaters"];
        break;
      case "Ostalo":
        mappedEventType = ["other"];
        break;
      case "Šou":
        mappedEventType = ["show"];
        break;
      case "Festival":
        mappedEventType = ["festival"];
        break;
      default:
        mappedEventType = [eventType];
    }

    const event = {
      performer_name: form.get("performerName"),
      poster: {
        landscape: "169.png",
        portrait: "45.png",
      },
      tickets: {
        total_amount: 0,
        type: {},
      },
      sponsors: sponsorNames,
      time_of_event: form.get("timeOfEvent"),
      place: {
        country: form.get("country"),
        city: form.get("city"),
        place: form.get("place"),
        type: typeOfPlace,
      },
      type: mappedEventType,
      is_promoted_event: false,
      description: form.get("eventDescription"),
      organizer: userId,
    };

    ticketInputs.forEach((ticket, index) => {
      const categoryKey = `category${index + 1}`;
      event.tickets.type[categoryKey] = {
        amount: ticket.amount,
        price: ticket.price,
        name: ticket.name,
      };

      event.tickets.total_amount += parseInt(ticket.amount);
    });

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
          process.env.REACT_APP_API_URL + "/api/v1/concerts/create_event",
          updatedEvent,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // UPLOAD IMAGES
        const formData = new FormData();

        for (let i = 0; i < sponsors.length; i++) {
          formData.append("firstFiles", sponsors[i], sponsorNames[i]);
        }

        for (let i = 0; i < selectedImagesForUpload.length; i++) {
          formData.append(
            "secondFiles",
            selectedImagesForUpload[i],
            uniqueNames[i]
          );
        }

        // Send formData to the backend

        await axios.post(
          process.env.REACT_APP_API_URL + "/api/v1/concerts/upload_img",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success(response.data.message, toastSetup);
      } catch (error) {
        // Handle any errors
        toast.error(
          `Došlo je do pogreške prilikom dodavanja događaja. ${error.response.data.error}!`,
          toastSetup
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
      if (document.querySelector(".event-description").value.length > 300) {
        toast.warn(
          `Opis događaja ne smije sadržavati više od 300 znakova`,
          toastSetup
        );
      }

      toast.warn(`Molimo popunite sva polja i dodajte obje slike`, toastSetup);
    }
  }

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

  return (
    <form className="form container organize-form" onSubmit={handleSubmit}>
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
              src={selectedImages[0]}
              alt="Upload"
              onClick={handleImageClick(0, 2 / 3)}
            />
          </div>
          <div className="landscape-wrapper">
            <img
              src={selectedImages[1]}
              alt="Upload"
              onClick={handleImageClick(1, 16 / 9)}
            />
          </div>
        </div>
      </div>
      <div className="organize-middle-part">
        <div>
          <input
            className="event-input"
            name="performerName"
            placeholder="Ime izvođača"
            min={3}
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
            <option value="Koncert">Koncert</option>
            <option value="Festival">Festival</option>
            <option value="Pozorište">Pozorište</option>
            <option value="Šou">Šou</option>
            <option value="Ostalo">Ostalo</option>
          </select>
        </div>
      </div>
      <div className="organize-middle-part">
        <div>
          <input
            name="sponsors"
            id="sponsors"
            className="custom-file-input event-input"
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
          />
          <ul className="sponsors-ul">
            {sponsors[0] !== undefined ? (
              sponsors.map((e, i) => {
                return <li key={i}>{e.name}</li>;
              })
            ) : (
              <li className="not-selected-sponsor">
                Sponzori nisu odabrani <span>*</span>
              </li>
            )}
          </ul>
        </div>
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
          <input
            name="country"
            type="text"
            className="location-input event-input"
            placeholder="Država"
            onInput={(e) => {
              e.target.style = "outline: none;";
            }}
          />
          <input
            name="city"
            type="text"
            className="location-input event-input"
            placeholder="Grad"
            onInput={(e) => {
              e.target.style = "outline: none;";
            }}
          />
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
            <option value="" disabled hidden>
              Mjesto
            </option>
            {renderConcertHallOptions()}
          </select>
        </div>
      </div>
      {/* Render input fields for ticket amount and price when "Dvorana Novi Travnik" is selected */}
      {selectedPlace && <>{renderTicketInputs()}</>}

      <div className="organize-bottom-part">
        <p className="textarea-limit">{textareaLimit}-300</p>
        <textarea
          name="eventDescription"
          onInput={(e) => {
            setTextareaLimit(e.target.value.length);
            e.target.style = "outline: none;";
          }}
          placeholder="Kratak opis događaja"
          className="event-description event-input"
          maxLength={300}
        ></textarea>
      </div>
      <div className="row">
        <button type="submit">Završi događaj</button>
      </div>
    </form>
  );
};
