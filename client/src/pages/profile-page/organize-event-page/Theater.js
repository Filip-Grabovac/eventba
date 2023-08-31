import React, { useEffect, useState } from "react";
import ImageMapper, { Mode } from "../../draw-place/image-mapper/ImageMapper";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";

export const Theater = ({ placeData }) => {
  const [groundPlanImg, setImg] = useState(null);
  const [modalWindow, setModalWindow] = useState(false);
  const [selectedZoneData, setSelectedZoneData] = useState();
  const [price, setPrice] = useState("");
  const [zones, setZones] = useState(placeData.zones);

  // Load ground image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/static/ground-plans/${placeData.ground_plan}`
        );

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Create an image element to calculate its dimensions
        const imgElement = new Image();

        // Set up the onload event handler
        imgElement.onload = () => {
          setImg({
            src: imageUrl,
            width: imgElement.width,
            height: imgElement.height,
          });
        };

        // Set the src AFTER defining the onload handler
        imgElement.src = imageUrl;
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, [placeData]);

  // Zone click
  function handleZoneClick(e, zoneData) {
    setModalWindow(true);
    setSelectedZoneData(zoneData);
    if (document.querySelector(".highlighted"))
      document.querySelector(".highlighted").classList.remove("highlighted");
    e.target.classList.add("highlighted");
  }

  // Save zone
  function saveZone(e) {
    e.preventDefault();

    if (!price) {
      document.querySelector(".price-input").style =
        "outline: 2px solid #f4cd46;";
      toast.warn("Unesite cijenu", toastSetup("top-right", 3000));
      return;
    }

    setZones((zone) => (zone[selectedZoneData[0]].price = Number(price)));

    document.querySelector(".highlighted").classList.add("done");
    document.querySelector(".highlighted").classList.remove("highlighted");
    setModalWindow(false);
  }
  const handleChange = (e) => setPrice(e.target.value);
  console.log(price);
  return (
    groundPlanImg && (
      <>
        {modalWindow ? (
          <>
            <div className="modal">
              <form action="">
                <h6>Odaberite cijenu sjedala za ovu zonu</h6>
                <input
                  value={price}
                  className="price-input"
                  type="number"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <button
                  onClick={(e) => {
                    saveZone(e);
                  }}
                >
                  Spremi
                </button>
              </form>
            </div>
            <div
              onClick={() => {
                setModalWindow(false);
              }}
              className="blur"
            ></div>
          </>
        ) : (
          ""
        )}
        <ImageMapper
          mode={Mode.SELECT}
          cb={(editor) => {
            editor.loadImage(groundPlanImg.src); // Load the URL directly
            editor.polygon();
          }}
          options={{
            width: groundPlanImg.width,
            height: groundPlanImg.height,
          }}
          handleZoneClick={handleZoneClick}
          preDrawnShapes={placeData}
        />
      </>
    )
  );
};
