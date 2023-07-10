import React, { useState } from "react";
import UploadImage from "../../../assets/images/uplad_img_placeholder.png";

export const OrganizeEventPage = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [textareaLimit, setTextareaLimit] = useState("0");
  const [selectedImages, setSelectedImages] = useState([
    UploadImage,
    UploadImage,
  ]);

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleImageClick = (index, aspectRatio) => () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (upload) => {
        const newImage = upload.target.result;

        const imageElement = document.createElement("img");
        imageElement.onload = () => {
          const width = imageElement.width;
          const height = imageElement.height;

          const imageAspectRatio = width / height;
          if (Math.abs(imageAspectRatio - aspectRatio) < 0.05) {
            const updatedImages = [...selectedImages];
            updatedImages[index] = newImage;
            setSelectedImages(updatedImages);
          } else {
            alert(
              `Please upload an image with a ${
                aspectRatio === 4 / 5 ? "4:5" : "16:9"
              } aspect ratio.`
            );
          }
        };

        imageElement.src = newImage;
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  return (
    <form className="form container organize-form">
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
          <div>
            <img
              src={selectedImages[0]}
              alt="Upload"
              onClick={handleImageClick(0, 4 / 5)}
            />
          </div>
          <div>
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
          <input placeholder="Ime izvođača" type="text" required />
        </div>
        <div className="select-div">
          <select value={selectedValue} onChange={handleSelectChange}>
            <option value="" disabled hidden>
              Odaberi tip događaja
            </option>
            <option value="Koncert">Koncert</option>
            <option value="Sport">Festival</option>
            <option value="Izložba">Pozorište</option>
            <option value="Izložba">Šou</option>
            <option value="Izložba">Ostalo</option>
          </select>
        </div>
      </div>
      <div className="organize-middle-part">
        <div>
          <input placeholder="Lokacija" type="text" required />
        </div>
        <div className="select-div">
          <input
            className="profile-date-input"
            placeholder="Vrijeme izvođenja"
            type="date"
            required
          />
        </div>
      </div>
      <div className="organize-bottom-part">
        <p className="textarea-limit">{textareaLimit}-300</p>
        <textarea
          onInput={(e) => {
            setTextareaLimit(e.target.value.length);
          }}
          placeholder="Kratak opis"
          className="event-description"
          maxLength={300}
        ></textarea>
      </div>
      <div className="row">
        <button type="submit">Završi događaj</button>
      </div>
    </form>
  );
};
