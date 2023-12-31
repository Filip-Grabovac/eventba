import React, { useState, useEffect, useRef } from "react";
import PlusIcon from "../../../assets/ikonice/plus_icon.svg";
import trashCan from "../../../assets/ikonice/trash_can.svg";
import axios from "axios";
import { toastSetup } from "../../../functions/toastSetup";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import { Theater } from "../organize-event-page/Theater";

export const TicketGen = ({
  concertData,
  setConcertData,
  adminEmail,
  adminName,
}) => {
  const [rowNum, setRowNum] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pdfFilePath, setPdfFilePath] = useState("");
  const [loader, setLoader] = useState(false);
  const firstInvalidInputRef = useRef(null);
  const [invalidInputs, setInvalidInputs] = useState([]);
  const [groundPlan, setGroundPlan] = useState();
  const [rows, setRows] = useState({});
  let placeData;

  placeData = {
    ground_plan: concertData.place.ground_plan,
    location: concertData.place.city,
    name: concertData.place.place,
    type: concertData.place.type,
    zones: concertData.tickets.online_sale.zones,
  };

  useEffect(() => {
    setRows(concertData.tickets.online_sale.zones);
  }, [concertData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setPdfFilePath("");
    setLoader(true);

    const categoryNames = tickets.map((ticket) => ticket.categoryName.trim());
    const hasDuplicates = new Set(categoryNames).size !== categoryNames.length;

    if (hasDuplicates) {
      toast.warn(
        "Molimo unesite jedinstvene nazive zona ulaznica.",
        toastSetup("top-right", 3000)
      );
      setLoader(false);
      return;
    }

    const hasInvalidData = tickets.some(
      (ticket) =>
        !ticket.categoryName || !ticket.ticketPrice || !ticket.ticketType
    );

    if (hasInvalidData) {
      const invalidFields = tickets
        .map((ticket, index) => ({
          index,
          fields: ["categoryName", "ticketPrice", "ticketType"].filter(
            (field) => !ticket[field]
          ),
        }))
        .filter((ticket) => ticket.fields.length > 0);

      toast.warn(
        "Molimo unesite sve potrebne podatke za zone ulaznica.",
        toastSetup("top-right", 3000)
      );
      if (invalidFields.length > 0) {
        setInvalidInputs(invalidFields);
        setLoader(false);
        return;
      }

      if (!firstInvalidInputRef.current) {
        setLoader(false);
        return;
      }

      const firstInvalidInputName = firstInvalidInputRef.current.name;
      if (
        ["categoryName", "ticketPrice", "ticketType"].includes(
          firstInvalidInputName
        )
      ) {
        firstInvalidInputRef.current.focus();
      }
      setLoader(false);
      return;
    }

    const totalTicketNum = tickets.reduce(
      (total, ticket) => total + parseInt(ticket.ticketsNum || 0),
      0
    );
    // Check if the total number of tickets is 0
    if (totalTicketNum === 0 && !concertData.type.includes("theaters")) {
      toast.warn(
        "Nema ulaznica za ispis. Unesite broj ulaznica za neku od zona.",
        toastSetup("top-right", 3000)
      );
      setLoader(false);
      return;
    }

    try {
      toast.success(
        `Ulaznice su tijeku izrade. Po završetku ih preuzmite izravno ili putem poveznice koja će vam biti poslana na ${adminEmail}`,
        toastSetup("top-right", 5000)
      );
      const filteredTickets = tickets.filter(
        (ticket) => ticket.ticketsNum !== ""
      );

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/freeSale/generate-tickets`,
        {
          ticketGenData: filteredTickets,
          concertData,
          adminEmail,
          adminName,
        }
      );

      setPdfFilePath(response.data.pdfFilePath);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${concertData._id}`
        );
        setConcertData(response.data[0]);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka o koncertu:", error);
      }
      setLoader(false);
      toast.success(
        "Generiranje ulaznica uspješno!",
        toastSetup("top-right", 3000)
      );
    } catch (error) {
      toast.error(
        "Problem s generiranjem ulaznica. Pokušajte ponovno kasnije...",
        toastSetup("top-right", 3000)
      );
    }
  };

  useEffect(() => {
    if (
      concertData.tickets.free_sale.zones &&
      concertData.place.type === "hall"
    ) {
      const initialRows = Object.keys(concertData.tickets.free_sale.zones).map(
        (categoryName) => ({
          categoryName,
          ticketType: concertData.tickets.free_sale.zones[categoryName].name,
          ticketsNum: "",
          ticketPrice:
            concertData.tickets.free_sale.zones[categoryName].price.toString(),
          ticketsAlready:
            concertData.tickets.free_sale.zones[categoryName].max_amount,
        })
      );
      setTickets(initialRows);
      setRowNum(initialRows.length);
    } else {
      setRowNum(0);
      setTickets([]);
    }
  }, [concertData]);

  const handleAddRow = () => {
    setRowNum((prevRowNum) => prevRowNum + 1);
    // Add a new ticket object to the tickets state when adding a row
    setTickets([
      ...tickets,
      { categoryName: "", ticketType: "", ticketsNum: "", ticketPrice: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedTickets = [...tickets];
    updatedTickets.splice(index, 1);
    setTickets(updatedTickets);
    setRowNum((prevRowNum) => prevRowNum - 1);
  };

  const handleInputChange = (e, index, field) => {
    const { name, value } = e.target;
    const updatedTickets = [...tickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [name]: value,
    };
    setTickets(updatedTickets);

    // Remove the invalid input from invalidInputs
    setInvalidInputs((prevInvalidInputs) =>
      prevInvalidInputs.filter((input) => input.index !== index)
    );

    setPdfFilePath("");
  };
  useEffect(() => {
    // Recalculate total number of tickets, total amount, and provision
    let totalTickets = 0;
    let totalAmount = 0;
    tickets.forEach((ticket) => {
      const ticketsNum = parseInt(ticket.ticketsNum, 10);
      const ticketPrice = parseFloat(ticket.ticketPrice.replace(",", "."));

      if (!isNaN(ticketsNum) && !isNaN(ticketPrice)) {
        totalTickets += ticketsNum;
        totalAmount += ticketsNum * ticketPrice;
      }
    });
    setTotalTickets(totalTickets);
    setTotalAmount(totalAmount.toFixed(2)); // Rounding to 2 decimal places
  }, [tickets]);

  return (
    <div className="generator-container">
      <form onSubmit={handleFormSubmit}>
        <div className="tickets-categories-container container-fluid">
          {concertData && concertData.place.type === "theater" ? (
            <Theater
              placeData={placeData}
              setRows={setRows}
              rows={rows}
              setGroundPlan={setGroundPlan}
              page="ticketGen"
              setTickets={setTickets}
              freeSale={concertData.tickets.free_sale}
              tickets={concertData.tickets}
            />
          ) : (
            Array.from({ length: rowNum }).map((_, i) => {
              const isDeletableRow =
                i >=
                Object.keys(concertData.tickets.free_sale.zones || []).length;
              const categoryNameRef = i === 0 ? firstInvalidInputRef : null;
              const ticketPriceRef = i === 0 ? null : firstInvalidInputRef;

              return (
                <div key={i} className="row">
                  <div className="col-lg-6">
                    <input
                      className={`event-input category-name ${
                        invalidInputs.some(
                          (input) =>
                            input.index === i &&
                            input.fields.includes("categoryName")
                        )
                          ? "invalid-input"
                          : ""
                      }`}
                      name="categoryName"
                      value={tickets[i]?.categoryName || ""}
                      placeholder="Zona ulaznice"
                      type="text"
                      onChange={(e) => handleInputChange(e, i, "categoryName")}
                      onInput={(e) => {
                        e.target.style = "outline: none;";
                      }}
                      disabled={!isDeletableRow}
                      ref={categoryNameRef}
                    />
                    <input
                      className={`event-input ticket-type ${
                        invalidInputs.some(
                          (input) =>
                            input.index === i &&
                            input.fields.includes("ticketType")
                        )
                          ? "invalid-input"
                          : ""
                      }`}
                      name="ticketType"
                      value={tickets[i]?.ticketType || ""}
                      placeholder="Tip ulaznice"
                      type="text"
                      onChange={(e) => handleInputChange(e, i, "ticketType")}
                      onInput={(e) => {
                        e.target.style = "outline: none;";
                      }}
                      disabled={!isDeletableRow}
                    />
                  </div>
                  <div className="col-lg-6 add-tickets-right-col">
                    <input
                      className="event-input tickets-num"
                      name="ticketsNum"
                      value={tickets[i]?.ticketsNum || ""}
                      placeholder={`Broj ulaznica. (${
                        tickets[i]?.ticketsAlready || "0"
                      })`}
                      type="text"
                      onChange={(e) => handleInputChange(e, i, "ticketsNum")}
                      onInput={(e) => {
                        e.target.style = "outline: none;";
                      }}
                    />
                    <div className="price">
                      <input
                        className={`event-input ticket-price ${
                          invalidInputs.some(
                            (input) =>
                              input.index === i &&
                              input.fields.includes("ticketPrice")
                          )
                            ? "invalid-input"
                            : ""
                        }`}
                        name="ticketPrice"
                        value={tickets[i]?.ticketPrice || ""}
                        placeholder="Cijena ulaznice"
                        type="text"
                        onChange={(e) => handleInputChange(e, i, "ticketPrice")}
                        onInput={(e) => {
                          e.target.style = "outline: none;";
                        }}
                        disabled={!isDeletableRow}
                        ref={ticketPriceRef}
                      />
                      <span>BAM</span>
                      {isDeletableRow && (
                        <img
                          src={trashCan}
                          alt="trash can"
                          onClick={() => handleRemoveRow(i)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {concertData && concertData.place.type !== "theater" ? (
          <img
            onClick={handleAddRow}
            className="add-category-icon"
            src={PlusIcon}
            alt="Add"
          />
        ) : (
          ""
        )}
        <h6>Ulaznice za printanje</h6>
        <div className="totals">
          <div className="total-summ">
            <p>Ukupan broj ulaznica: {totalTickets}</p>
            <p>Ukupan iznos: {totalAmount} BAM</p>

            {concertData.place.type === "theater" && (
              <div className="legend">
                <div className="online">Online prodaja</div>
                <div className="free">Slobodna prodaja</div>
                <div className="available">Dostupne zone</div>
                <div className="selected">Odabrane zone</div>
              </div>
            )}
          </div>
          {concertData.place.type === "theater" && (
            <div className="total-per-zone">
              {tickets.map((ticket, i) => (
                <div className="zone" key={i}>
                  <p>
                    Zona: {ticket.categoryName} - {ticket.ticketType} - Broj
                    ulaznica {ticket.ticketsNum}{" "}
                    <span>
                      - Cijena {ticket.ticketPrice} <small>BAM</small>{" "}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="button-wrapper">
          <button type="submit" className="add-tickets-btn">
            Izradi ulaznice
          </button>
          {loader ? (
            <div className="loader">
              <Bars height="50" width="50" color="#455cd9" />{" "}
            </div>
          ) : null}
          {pdfFilePath ? (
            <a
              className="download-tickets-btn-wrapper"
              href={`${process.env.REACT_APP_API_URL}/api/v1/freeSale/download-tickets?pdfFilePath=${pdfFilePath}`}
              download
            >
              <button type="button" className="download-tickets-btn">
                Preuzmi ulaznice
              </button>
            </a>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default TicketGen;
