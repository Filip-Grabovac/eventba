import React, { useEffect, useState } from "react";
import ImageMapper, { Mode } from "../../draw-place/image-mapper/ImageMapper";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";

export const Theater = ({
  placeData,
  setRows,
  rows,
  setGroundPlan,
  page,
  setTickets,
  freeSale,
  tickets,
}) => {
  const [groundPlanImg, setImg] = useState(null);
  const [modalWindow, setModalWindow] = useState(false);
  const [selectedZoneData, setSelectedZoneData] = useState();
  const [selectedZone, setSelectedZone] = useState([]);
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  // Load ground image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/static/ground-plans/${placeData.ground_plan}`
        );

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Extract the image name from the URL
        const imageName = placeData.ground_plan.split("/").pop();

        // Create an image element to calculate its dimensions
        const imgElement = new Image();

        // Set up the onload event handler
        imgElement.onload = () => {
          setImg({
            src: imageUrl,
            width: imgElement.width,
            height: imgElement.height,
          });

          // Set the image name in setGroundPlan
          setGroundPlan(imageName);
        };

        // Set the src AFTER defining the onload handler
        imgElement.src = imageUrl;
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, [placeData.name]);

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
    const isCheckboxChecked = document.querySelector(
      ".disable-zone-checkbox"
    ).checked;

    let zoneKey = selectedZoneData[0];

    if (isCheckboxChecked) {
      document.getElementById(`${zoneKey}`).classList.remove("done");
      setType("");
    } else {
      if (!price) {
        document.querySelector(".price-input").style =
          "outline: 2px solid #f4cd46;";
        toast.warn("Unesite cijenu", toastSetup("top-right", 3000));
        return;
      }
      if (!type) {
        document.querySelector(".ticket-type").style =
          "outline: 2px solid #f4cd46;";
        toast.warn("Molimo unesite tip.", toastSetup("top-right", 3000));
        return;
      }
      // Do work if everything is alright
      // Fill the seats array, that seats are avilable

      document.querySelector(".highlighted").classList.add("done");
    }

    // Update the rows state to include the new seats array
    setRows((prevRows) => {
      const zone = prevRows[zoneKey];
      const rows = zone.rows;

      for (let key in rows) {
        if (rows.hasOwnProperty(key)) {
          let row = rows[key];
          const totalSeats = Number(row.total_seats);

          // Create an array of seat numbers based on the total_seats value
          if (!isCheckboxChecked)
            row.seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
          else {
            row.seats = [];
          }
        }
      }

      // Calculate the total number of seats for all rows in the zone
      const totalSeatsInZone = Object.values(zone.rows).reduce(
        (total, row) => total + Number(row.total_seats),
        0
      );

      // Create a new row object
      const newZone = {
        price: Number(price),
        name: isCheckboxChecked ? "" : type,
        max_amount: totalSeatsInZone,
        amount: totalSeatsInZone,
        rows,
      };

      // Set tickets info for printing drawed places
      if (page === "ticketGen")
        setTickets((tickets) => {
          const disableCheckbox = document.querySelector(
            ".disable-zone-checkbox"
          );
          if (disableCheckbox.checked) {
            // If the checkbox is checked, remove the element with the matching zoneKey
            return tickets.filter((ticket) => ticket.categoryName !== zoneKey);
          } else {
            // If the checkbox is not checked, perform the same logic as before
            const existingTicketIndex = tickets.findIndex(
              (ticket) => ticket.categoryName === zoneKey
            );

            if (existingTicketIndex !== -1) {
              // If a ticket with the same categoryName exists, update it
              const updatedTickets = [...tickets];
              updatedTickets[existingTicketIndex] = {
                ...updatedTickets[existingTicketIndex],
                ticketType: document.querySelector(".ticket-type").value,
                ticketPrice: document.querySelector(".price-input").value,
              };
              return updatedTickets;
            } else {
              // If no ticket with the same categoryName exists, add a new one
              return [
                ...tickets,
                {
                  categoryName: zoneKey,
                  ticketType: document.querySelector(".ticket-type").value,
                  ticketsNum: zone.total_amount,
                  ticketPrice: document.querySelector(".price-input").value,
                  rows: Object.keys(zone.rows).reduce((acc, rowKey) => {
                    acc[rowKey] = {
                      total_seats: zone.rows[rowKey].total_seats,
                    };
                    return acc;
                  }, {}),
                },
              ];
            }
          }
        });

      return {
        ...prevRows,
        [zoneKey]: {
          ...prevRows[zoneKey],
          price: newZone.price,
          name: newZone.name,
          max_amount: newZone.max_amount,
          amount: newZone.amount,
          rows,
        },
      };
    });

    document.querySelector(".highlighted").classList.remove("highlighted");
    setModalWindow(false);
  }

  const handleCheckboxChange = (zoneKey) => {
    const updatedSelectedZone = [...selectedZone];

    if (updatedSelectedZone.includes(zoneKey)) {
      // If the zoneKey is already in the selectedZone array, remove it
      const index = updatedSelectedZone.indexOf(zoneKey);
      if (index !== -1) {
        updatedSelectedZone.splice(index, 1);
      }
    } else {
      // If the zoneKey is not in the selectedZone array, add it
      updatedSelectedZone.push(zoneKey);
    }

    setSelectedZone(updatedSelectedZone);
  };

  function saveRows(e) {
    e.preventDefault();
    const rowsPrice = document.querySelector(".rows-price").value;
    const rowsCategory = document.querySelector(".rows-category").value;

    if (rowsPrice === "" || rowsCategory === "" || !selectedZone[0]) {
      toast.warn(
        "Molimo unesite cijenu, kategoriju i odaberite barem jednu zonu.",
        toastSetup("top-right", 3000)
      );
      return;
    }

    // Update the rows state for each selected zone
    selectedZone.forEach((zoneKey) => {
      document.getElementById(`${zoneKey}`).classList.add("done");
      setRows((prevRows) => {
        const zone = prevRows[zoneKey];
        const rows = zone.rows;

        for (let key in rows) {
          if (rows.hasOwnProperty(key)) {
            let row = rows[key];
            const totalSeats = Number(row.total_seats);

            // Create an array of seat numbers based on the total_seats value

            row.seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
          }
        }
        // Set tickets
        if (page === "ticketGen") {
          setTickets((tickets) => {
            // If the checkbox is not checked, perform the same logic as before
            const existingTicketIndex = tickets.findIndex(
              (ticket) => ticket.categoryName === zoneKey
            );

            if (existingTicketIndex !== -1) {
              // If a ticket with the same categoryName exists, update it
              const updatedTickets = [...tickets];
              updatedTickets[existingTicketIndex] = {
                ...updatedTickets[existingTicketIndex],
                ticketType: document.querySelector(".rows-category").value,
                ticketPrice: document.querySelector(".rows-price").value,
              };
              return updatedTickets;
            } else {
              // If no ticket with the same categoryName exists, add a new one
              return [
                ...tickets,
                {
                  categoryName: zoneKey,
                  ticketType: document.querySelector(".rows-category").value,
                  ticketsNum: zone.total_amount,
                  ticketPrice: document.querySelector(".rows-price").value,
                  rows: Object.keys(zone.rows).reduce((acc, rowKey) => {
                    acc[rowKey] = {
                      total_seats: zone.rows[rowKey].total_seats,
                    };
                    return acc;
                  }, {}),
                },
              ];
            }
          });
        }

        // Calculate the total number of seats for all rows in the zone
        const totalSeatsInZone = Object.values(zone.rows).reduce(
          (total, row) => total + Number(row.total_seats),
          0
        );

        // Update the 'amount' field with the total number of seats
        return {
          ...prevRows,
          [zoneKey]: {
            ...zone, // Use the 'zone' object directly here
            price: Number(rowsPrice),
            name: rowsCategory,
            amount: totalSeatsInZone,
            max_amount: totalSeatsInZone,
            rows,
          },
        };
      });
    });
    toast.success(
      "Uspješno ste dodali cijenu i kategoriju za odabrane zone.",
      toastSetup("top-right", 3000)
    );
  }

  // Function to select all checkboxes
  const selectAll = () => {
    const allZoneKeys = Object.keys(placeData.zones);

    if (selectedZone.length === allZoneKeys.length) {
      // If all are already selected, unselect all
      setSelectedZone([]);
    } else {
      setSelectedZone(allZoneKeys);
    }
  };

  // Function to unselect all checkboxes
  const unselectAll = () => {
    setSelectedZone([]);
  };

  return (
    groundPlanImg && (
      <>
        {modalWindow ? (
          <>
            <div className="modal">
              <div className="">
                <h6 className="disable-zone">Zabrani prodaju</h6>
                <input className="disable-zone-checkbox" type="checkbox" />
              </div>
              <div className="">
                <h6>Cijena zone</h6>
                <input
                  value={price}
                  className="price-input"
                  type="number"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
              <div className="">
                <h6>Tip ulaznice</h6>
                <input
                  value={type}
                  className="price-input ticket-type"
                  type="text"
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  saveZone(e);
                }}
              >
                Spremi
              </button>
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
        {groundPlanImg && (
          <div className="organize-event-plan-wrapper">
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
              preDrawnShapes={rows}
              page={page}
              freeSale={freeSale}
              tickets={tickets}
            />
            <div className="select-all-seats-wrapper">
              <h6>Odredi cijenu i kategoriju za više redova</h6>

              <div className="organize-zones-wrapper">
                {Object.entries(placeData.zones).map(([zoneKey, value], i) => {
                  const isChecked = selectedZone.includes(zoneKey);

                  return (
                    <div className="selling-row" key={i}>
                      <p>Zona {zoneKey}</p>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(zoneKey)}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="zones-input-wrapper">
                <input
                  className="rows-price"
                  type="number"
                  placeholder="Cijena"
                />
                <input
                  className="rows-category"
                  type="text"
                  placeholder="Kategorija"
                />
                <div className="button-wrapper">
                  {selectedZone.length < 1 ? (
                    <button type="button" onClick={selectAll}>
                      Odaberi sve
                    </button>
                  ) : (
                    <button type="button" onClick={unselectAll}>
                      Poništi odabir
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      saveRows(e);
                    }}
                  >
                    Spremi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  );
};
