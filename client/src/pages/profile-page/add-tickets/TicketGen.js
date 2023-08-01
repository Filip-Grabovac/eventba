import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import the translation hook
import PlusIcon from "../../../assets/ikonice/plus_icon.svg";
import trashCan from "../../../assets/ikonice/trash_can.svg";

export const TicketGen = () => {
  const [rowNum, setRowNum] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [provision, setProvision] = useState(0);

  const { t } = useTranslation(); // Initialize the translation hook

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(tickets);
    // You can add further logic here to process the tickets data or send it to the server.
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
            Provizija: {1.5 * totalTickets} BAM{" "}
            <small>(1.5 BAM po ulaznici)</small>
          </p>
        </div>
        <button type="submit" className="add-tickets-btn">
          Izradi ulaznice
        </button>
      </form>
    </div>
  );
};

export default TicketGen;
