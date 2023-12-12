import React, { useEffect, useState } from "react";
import Plus from "../../assets/ikonice/plus_icon.svg";
import HandDrawn from "../../assets/ikonice/hand_drawn.svg";
import Edit from "../../assets/ikonice/edit_icon2.svg";
import Save from "../../assets/ikonice/save_icon.svg";
import ImageMapper, { Mode } from "./image-mapper/ImageMapper";
import { toast } from "react-toastify";
import { toastSetup } from "../../functions/toastSetup";

export const DrawPlace = () => {
  const [img, setImg] = useState();
  const [shape, setShape] = useState(Mode.RECT);
  const [numOfRows, setNumOfRows] = useState(1);
  const [modal, setVisibility] = useState(false);

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);

      // Create an image element to calculate its dimensions
      const imgElement = new Image();

      // Set up the onload event handler
      imgElement.onload = () => {
        // Here, you have access to imgElement.width and imgElement.height

        setImg({
          src: imageUrl,
          filename: selectedImage.name,
          width: imgElement.width,
          height: imgElement.height,
        });
      };

      // Set the src AFTER defining the onload handler
      imgElement.src = imageUrl;
    }
  };

  // Handle shape click
  function handleShapeClick(e) {
    const tagName = e.target.tagName.toLowerCase();

    if (tagName === "polygon" || tagName === "rect") {
      if (document.querySelector(".highlighted"))
        document.querySelector(".highlighted").classList.remove("highlighted");
      e.target.classList.add("highlighted");
      setVisibility(true);
    } else {
      if (document.querySelector(".highlighted") && tagName !== "circle")
        document.querySelector(".highlighted").classList.remove("highlighted");
    }
  }

  // Set active link
  function setActiveLink(e) {
    document.querySelector(".active-link").classList.remove("active-link");
    e.target.classList.add("active-link");
    if (document.querySelector(".highlighted"))
      document.querySelector(".highlighted").classList.remove("highlighted");
  }

  useEffect(() => {
    function handleDelete(event) {
      if (event.key === "Backspace" && document.querySelector(".highlighted")) {
        const highlighted = document.querySelector(".highlighted");

        document
          .querySelectorAll('circle[visibility="visible"]')
          .forEach((circle) => {
            circle.style.visibility = "hidden";
          });
        highlighted.remove();
      }
    }

    if (!modal) {
      document.addEventListener("keydown", handleDelete);
    } else {
      document.removeEventListener("keydown", handleDelete);
    }

    // Clean up the event listener when the component unmounts or when modal changes
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, [modal]);

  // Add rows
  function addRows() {
    setNumOfRows((numOfRows) => numOfRows + 1);
  }

  // Save zone
  function saveZone() {
    let counter = 0;

    document.querySelectorAll(`.zone-input`).forEach((e, i) => {
      if (e.value === "") {
        e.style = "outline: 2px solid #f4cd46;";
        counter++;
      }
    });

    // Display different errors
    if (counter > 0) {
      toast.warn("Molimo unesite sva polja", toastSetup("top-right", 3000));
    } else {
      setVisibility(false);
      setNumOfRows(1);
      toast.success("Uspješno ste dodali zonu.", toastSetup("top-right", 3000));
      document.querySelector(".highlighted").classList.add("done");
      document.querySelector(".highlighted").classList.remove("highlighted");
      document
        .querySelectorAll('circle[visibility="visible"]')
        .forEach((circle) => {
          circle.style.visibility = "hidden";
        });
    }
  }
  return (
    <div style={img && { minHeight: "100vh" }} className="draw-place-container">
      {modal && (
        <>
          <div className="draw-modal">
            <h6 className="main-modal-heading">Podatci o zoni</h6>
            <div>
              <p>Redovi</p>
              <div className="row-wrapper">
                {Array.from({ length: numOfRows }, (_, i) => (
                  <div key={i}>
                    <h6>Red {i + 1}</h6>
                    <input
                      className="zone-input"
                      type="number"
                      placeholder="Broj sjedala"
                      onInput={(e) => {
                        e.target.style = "outline: none;";
                      }}
                    />
                  </div>
                ))}
              </div>
              <img onClick={addRows} src={Plus} alt="Dodaj" />
            </div>
            <div className="seats-price-wrapper">
              <p>Cijena sjedala za ovu zonu</p>
              <input
                onInput={(e) => {
                  e.target.style = "outline: none;";
                }}
                className="zone-input"
                type="number"
                placeholder="BAM"
              />
            </div>
            <a
              onClick={() => {
                saveZone();
              }}
              className="save-zone"
              href="#"
            >
              Spremi
            </a>
          </div>
          <div
            onClick={() => {
              setVisibility(false);
              setNumOfRows(1);
            }}
            className="blur"
          ></div>
        </>
      )}
      {!img && (
        <>
          <h5>Unesite sliku za iscrtavanje</h5>
          <label className="add-image-label">
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <img className="plus-icon" src={Plus} alt="Dodaj" />
          </label>
        </>
      )}
      {img && (
        <div className="buttons-wrapper">
          <a
            onClick={(e) => {
              setShape(Mode.RECT);
              setActiveLink(e);
            }}
            className="active-link"
            href="#"
          >
            Pravokutnik <div className="rectangle"></div>
          </a>
          <a
            onClick={(e) => {
              setShape(Mode.POLYGON);
              setActiveLink(e);
            }}
            href="#"
          >
            Ručno crtanje <img src={HandDrawn} alt="Rucno crtanje" />
          </a>
          <a
            onClick={(e) => {
              setShape(Mode.SELECT);
              setActiveLink(e);
            }}
            href="#"
          >
            Uređivanje <img src={Edit} alt="Uredjivanje" />
          </a>
        </div>
      )}
      {img && (
        <>
          <div className="img-container">
            <ImageMapper
              mode={shape}
              cb={(editor) => {
                editor.loadImage(img.src);
                editor.polygon();
              }}
              options={{ width: img.width, height: img.height }}
              handleShapeClick={handleShapeClick}
            />
          </div>
          <a className="save-map" href="#">
            Spremi
            <img src={Save} alt="Spremi" />
          </a>
        </>
      )}
    </div>
  );
};
