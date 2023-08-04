import React, { useState, useEffect } from "react";
import PlusIcon from "../../../assets/ikonice/plus_icon.svg";
import trashCan from "../../../assets/ikonice/trash_can.svg";
import axios from "axios";
import { toastSetup } from "../../../functions/toastSetup";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";

export const TicketGen = ({ concertData }) => {
  const [rowNum, setRowNum] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [provision, setProvision] = useState(0);
  const [pdfFilePath, setPdfFilePath] = useState("");
  const [loader, setLoader] = useState(false);
  console.log(pdfFilePath);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setPdfFilePath("");
    setLoader(true);
    console.log({
      ticketGenData: tickets,
      concertData,
    });

    try {
      // Send the POST request using Axios and wait for the response
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/freeSale/generate-tickets`,
        {
          ticketGenData: tickets,
          concertData,
        }
      );

      // Extract the pdfFilePath from the response and update the state
      const { pdfFilePath } = response.data;
      setPdfFilePath(pdfFilePath);
      setLoader(false);
      // Show a toast message or any other indication that the tickets have been generated successfully
      toast.success(
        "Generacija ulaznica uspješna. Preuzmite ulaznice direktno ili putem linka koji će biti poslan na mail.",
        toastSetup("top-right", 5000)
      );
    } catch (error) {
      // Handle any errors that occurred during the request
      toast.error(
        "Problem s generacijom ulaznica, pokušajte kasnije...",
        toastSetup("top-right", 3000)
      );
    }
  };

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
    setProvision((1.5 * totalTickets).toFixed(2));
  }, [tickets]);

  return (
    <div className="generator-container">
      <form onSubmit={handleFormSubmit}>
        <div className="tickets-categories-container container-fluid">
          {Array.from({ length: rowNum }).map((_, i) => {
            return (
              <div key={i} className="row">
                <div className="col-lg-6">
                  <input
                    className="event-input category-name"
                    name="categoryName"
                    value={tickets[i]?.categoryName || ""}
                    placeholder="Ime kategorije"
                    type="text"
                    onChange={(e) => handleInputChange(e, i, "categoryName")}
                    onInput={(e) => {
                      e.target.style = "outline: none;";
                    }}
                  />
                  <input
                    className="event-input ticket-type"
                    name="ticketType"
                    value={tickets[i]?.ticketType || ""}
                    placeholder="Tip ulaznice"
                    type="text"
                    onChange={(e) => handleInputChange(e, i, "ticketType")}
                    onInput={(e) => {
                      e.target.style = "outline: none;";
                    }}
                  />
                </div>
                <div className="col-lg-6 add-tickets-right-col">
                  <input
                    className="event-input tickets-num"
                    name="ticketsNum"
                    value={tickets[i]?.ticketsNum || ""}
                    placeholder="Broj ulaznica"
                    type="text"
                    onChange={(e) => handleInputChange(e, i, "ticketsNum")}
                    onInput={(e) => {
                      e.target.style = "outline: none;";
                    }}
                  />
                  <div className="price">
                    <input
                      className="event-input ticket-price"
                      name="ticketPrice"
                      value={tickets[i]?.ticketPrice || ""}
                      placeholder="Cijena ulaznice"
                      type="text"
                      onChange={(e) => handleInputChange(e, i, "ticketPrice")}
                      onInput={(e) => {
                        e.target.style = "outline: none;";
                      }}
                    />
                    <span>BAM</span>
                    <img
                      src={trashCan}
                      alt="trash can"
                      onClick={() => handleRemoveRow(i)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <img
          onClick={handleAddRow}
          className="add-category-icon"
          src={PlusIcon}
          alt="Add"
        />
        <div className="totals">
          <p>Ukupan broj ulaznica: {totalTickets}</p>
          <p>Ukupan iznos: {totalAmount} BAM</p>
          <p>
            Provizija: {provision} BAM <small>(1.5 BAM po ulaznici)</small>
          </p>
        </div>
        <button type="submit" className="add-tickets-btn">
          Izradi ulaznice
        </button>
      </form>
      {loader ? (
        <div className="loader">
          <Bars height="50" width="50" color="#455cd9" />{" "}
        </div>
      ) : null}
      {pdfFilePath ? (
        <a
          href={`${process.env.REACT_APP_API_URL}/api/v1/freeSale/download-tickets?pdfFilePath=${pdfFilePath}`}
          download
        >
          <button className="download-tickets-btn">Preuzmi ulaznice</button>
        </a>
      ) : null}
    </div>
  );
};

export default TicketGen;
