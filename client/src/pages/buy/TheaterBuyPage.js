import React, { useEffect, useState } from "react";
import ImageMapper, { Mode } from "../draw-place/image-mapper/ImageMapper";
import { useDispatch } from "react-redux";
import { addTicketPrice } from "../../store/ticketSlice";

export const TheaterBuyPage = ({ concertData, ticketID }) => {
  const [groundPlanImg, setImg] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedZoneData, setSelectedZoneData] = useState();
  const [zones, setZones] = useState(concertData.tickets.online_sale.zones);
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
    setModal(true);
    setSelectedZoneData(data);
  }

  const takeSeat = async (seatNumber) => {
    if (selectedZoneData) {
      const zoneKey = selectedZoneData[0];
      const rowInfo = selectedZoneData[1].rows[zoneKey];

      await dispatch(
        addTicketPrice({
          ticketPrice: Number(selectedZoneData[1].price),
          ticketID,
          category: `Red: ${zoneKey} - Mjesto: ${seatNumber}`,
          name: selectedZoneData[1].name,
        })
      );

      setZones((prevRows) => {
        const newZones = { ...prevRows };
        const rowToUpdate = newZones[zoneKey].rows[zoneKey];
        const seatIndex = rowToUpdate.seats.indexOf(seatNumber);

        if (seatIndex !== -1) {
          // Seat is currently reserved by the same ticket, remove it
          if (rowToUpdate.reserved_seats[seatIndex]?.ticketID === ticketID) {
            rowToUpdate.reserved_seats.splice(seatIndex, 1);
          }
        } else {
          // Seat is currently free, add it to the seats array and set it as reserved
          rowToUpdate.seats.push(seatNumber);
          // Add the seat to the reserved_seats array with the associated ticketID
          rowToUpdate.reserved_seats.push({ seatNumber, ticketID });
        }

        return {
          ...prevRows,
          [zoneKey]: {
            ...prevRows[zoneKey],
            rows: {
              ...prevRows[zoneKey].rows,
              [zoneKey]: rowToUpdate,
            },
          },
        };
      });

      setModal(false);
    }
  };

  return (
    <div className="buy-plan-wrapper">
      {modal ? (
        <>
          <div className="modal">
            <h6>Odaberi sjedalo</h6>
            {selectedZoneData &&
              Object.entries(selectedZoneData[1].rows).map(([key, value]) => {
                return (
                  <div key={key} className="seats-container">
                    <p>Red: {key}</p>
                    <div className="seats-wrapper">
                      {Array.from(
                        { length: Number(value.total_seats) },
                        (_, i) => (
                          <div
                            className={
                              value.seats.includes(i + 1)
                                ? value.reserved_seats?.includes(i + 1)
                                  ? `reserved`
                                  : `free`
                                : `sold`
                            }
                            key={i}
                            onClick={() => {
                              takeSeat(i + 1);
                            }}
                          >
                            {i + 1}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            <a
              onClick={() => {
                setModal(false);
              }}
            >
              Spremi
            </a>
          </div>
          <div
            onClick={() => {
              setModal(false);
            }}
            className="blur"
          ></div>
        </>
      ) : (
        ""
      )}
      {groundPlanImg && (
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
          preDrawnShapes={zones}
        />
      )}
    </div>
  );
};
