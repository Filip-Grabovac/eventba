import React, { useState } from "react";
import UploadImage from "../../../assets/images/uplad_img_placeholder.png";
import { toast } from "react-toastify";
import axios from "axios";

export const OrganizeEventPage = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [textareaLimit, setTextareaLimit] = useState("0");
  const [selectedImages, setSelectedImages] = useState([
    UploadImage,
    UploadImage,
  ]);
  const [selectedImagesForUpload, setImages] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");

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

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // Image upload logic
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
          if (Math.abs(imageAspectRatio - aspectRatio) < 0.05) {
            // Remove outline if user set image
            if (index === 0)
              document.querySelector(".portrait-wrapper").style =
                "outline: none";
            else
              document.querySelector(".landscape-wrapper").style =
                "outline: none";

            const updatedImages = [...selectedImages];
            updatedImages[index] = newImage;
            setSelectedImages(updatedImages);
          } else {
            toast.warn(
              `Molimo dodajte sliku s ${
                aspectRatio === 4 / 5 ? "4:5" : "16:9"
              } formatom.`,
              toastSetup
            );
          }
        };

        imageElement.src = newImage;
      };

      reader.readAsDataURL(file);
      setImages((prevImages) => [...prevImages, input.files[0]]);
    };
    input.click();
  };

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    // Create event
    const event = {
      performer_name: form.get("performerName"),
      poster: {
        landscape: "169.png",
        portrait: "45.png",
      },
      tickets: {
        total_amount: 2000,
        type: {
          parter: {
            amount: 123,
            sold_amount: 123,
            price: "5€",
          },
        },
      },
      time_of_event: form.get("timeOfEvent"),
      place: {
        country: form.get("country"),
        city: form.get("city"),
        place: form.get("place"),
      },
      type: form.get("eventType"),
      is_promoted_event: false,
      description: form.get("eventDescription"),
    };

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
      // Add event
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + "/api/v1/concerts/create_event",
          {
            ...event,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // UPLOAD IMAGES
        const formData = new FormData();

        for (let i = 0; i < sponsors.length; i++) {
          formData.append("firstFiles", sponsors[i]);
        }

        for (let i = 0; i < selectedImagesForUpload.length; i++) {
          formData.append("secondFiles", selectedImagesForUpload[i]);
        }

        // Send formData to the backend
        await fetch(
          process.env.REACT_APP_API_URL + "/api/v1/concerts/upload_img",
          {
            method: "POST",
            body: formData,
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

    // Check if the file already exists
    const isFileExists = sponsors.some(
      (sponsor) => sponsor.name === fileList[0].name
    );

    if (!isFileExists) {
      setSponsors((s) => [...s, fileList[0]]);
    }
  };

  return (
    <form className="form container organize-form" onSubmit={handleSubmit}>
      <div className="organize-top-part">
        <div>
          <h3>
            Portretna slika <span>(4:5)</span>
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
              onClick={handleImageClick(0, 4 / 5)}
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
            type="date"
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
            onChange={(e) => {
              setSelectedPlace(e.target.value);
            }}
            onChangeCapture={(e) => {
              e.target.style = "outline: none;";
            }}
          >
            <option value="" disabled hidden>
              Mjesto
            </option>
            <option value="Dvorana Travnik">Dvorana Travnik</option>
          </select>
        </div>
      </div>
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
