import React, { useEffect, useState } from "react";
import ImageMapper, { Mode } from "../draw-place/image-mapper/ImageMapper";
import { useDispatch } from "react-redux";
import { addTicketPrice } from "../../store/ticketSlice";
import { TheaterModal } from "./ticket-type/TheaterModal";

export const TheaterBuyPage = ({
  concertData,
  activeCardIndex,
  theaterZones,
  setTheaterZones,
  setShowPaymentForm,
  selectedZoneData,
  setSelectedZoneData,
}) => {
  const [groundPlanImg, setImg] = useState(null);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();

  addTicketPrice();
  // Load ground image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/static/ground-plans/${concertData.place.ground_plan}`
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
  }, [concertData]);

  // Hanlde zone click (select seat)
  function handleZoneClick(e, data) {
    setShowPaymentForm(false);
    setModal(true);
    setSelectedZoneData(data);
    const selected = document.querySelector(".selected");
    if (selected) selected.classList.remove("selected");
    e.target.classList.add("selected");
  }

  // TEST
  //
  //
  //
  const takeSeat = async (seatNumber, ticketID, row) => {
    if (selectedZoneData) {
      setShowPaymentForm(false);
      setTheaterZones((prevZones) => {
        const newZones = { ...prevZones };
        const selectedZoneDataKey = selectedZoneData[0];

        // Iterate through all zones
        for (const zoneKey in newZones) {
          const zone = newZones[zoneKey];
          const rowToUpdate = zone.rows[zoneKey];

          // Initialize reserved_seats as an empty object if it's undefined
          rowToUpdate.reserved_seats = rowToUpdate.reserved_seats || {};

          // If it's the selected zone, update reservations
          if (zoneKey === selectedZoneDataKey) {
            // Remove all reservations with the same ticketID
            for (const seatKey in rowToUpdate.reserved_seats) {
              if (rowToUpdate.reserved_seats[seatKey].ticketID === ticketID) {
                delete rowToUpdate.reserved_seats[seatKey];
              }
            }
            // Reserve the new seat with the associated ticketID
            rowToUpdate.reserved_seats[seatNumber] = { seatNumber, ticketID };

            // Update the zone's row with the modified row
            newZones[zoneKey].rows[zoneKey] = rowToUpdate;
          } else {
            // For other zones, delete all reservations with the same ticketID
            for (const seatKey in rowToUpdate.reserved_seats) {
              if (rowToUpdate.reserved_seats[seatKey].ticketID === ticketID) {
                delete rowToUpdate.reserved_seats[seatKey];
              }
            }
          }
        }

        // Dispatch the action and update the state as before

        return newZones;
      });
      dispatch(
        addTicketPrice({
          ticketPrice: Number(selectedZoneData[1].price),
          ticketID,
          category: selectedZoneData[0],
          seat: seatNumber,
          row,
          name: selectedZoneData[1].name,
        })
      );
    }
  };

  return (
    <div className="buy-plan-wrapper">
      {modal && theaterZones && (
        <>
          <TheaterModal
            selectedZoneData={selectedZoneData}
            theaterZones={theaterZones}
            setShowPaymentForm={setShowPaymentForm}
            takeSeat={takeSeat}
            activeCardIndex={activeCardIndex}
          />

          <div
            onClick={() => {
              setModal(false);
            }}
            className="blur"
          ></div>
        </>
      )}

      {groundPlanImg && theaterZones && (
        <>
          <div
            id="tooltip"
            display="none"
            style={{ position: "absolute", display: "none" }}
          ></div>
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
            preDrawnShapes={theaterZones}
            page="buyPage"
          />
        </>
      )}
    </div>
  );
};
