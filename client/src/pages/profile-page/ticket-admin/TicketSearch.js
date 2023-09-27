import React, { useEffect, useState } from "react";
import axios from "axios";
import { toastSetup } from "../../../functions/toastSetup";
import { toast } from "react-toastify";
import check from "../../../assets/ikonice/check2_icon.svg";
import X from "../../../assets/ikonice/X2.svg";

const TicketSearch = ({ concertId, tickets, setTickets }) => {
  const [position, setPosition] = useState("");

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/tickets/tickets_for_${concertId}/${position}`
      );
      setTickets([response.data.ticket]);
    } catch (error) {
      console.log(error.response.data.msgInfo);
      toast.error(error.response.data.msgInfo, toastSetup("top-center", 3000));
      setTickets([]);
    }
    setEmail("");
  };

  const handleSearchByEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/tickets/find_by_email/tickets_for_${concertId}/${email}`
      );
      setTickets(response.data.tickets);
    } catch (error) {
      console.log(error.response.data.msgInfo);
      toast.error(error.response.data.msgInfo, toastSetup("top-center", 3000));
      setTickets([]);
    }

    setPosition("");
  };

  const toggleTicketValidity = async (ticketToToggle) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/tickets/tickets_for_${concertId}/${ticketToToggle._id}`
      );

      setTickets((tickets) =>
        tickets.map(
          (ticket) =>
            ticket._id === ticketToToggle._id
              ? response.data.updatedTicket // Ažuriraj samo odgovarajuću ulaznicu
              : ticket // Za ostale ulaznice zadrži originalne podatke
        )
      );
    } catch (error) {
      console.log(error.response.data.msgInfo);
      toast.error(error.response.data.msgInfo, toastSetup("top-center", 3000));
    }
  };

  return (
    <div>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Redni broj"
            className="ticket-finder-input"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <button className="ticket-finder" type="submit">
            Pretraži po broju
          </button>
        </form>

        <form onSubmit={handleSearchByEmail}>
          <input
            className="ticket-finder-input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="ticket-finder" type="submit">
            Pretraži po emailu
          </button>
        </form>
      </div>
      {tickets &&
        tickets.map((ticket) => (
          <div key={ticket._id} className="ticket">
            <div style={{ fontWeight: "bold" }}>
              {ticket.sent_on_email
                ? `Online ulaznica - ${ticket.performer_name}`
                : `Ulaznica za slobodnu prodaju - ${ticket.performer_name}`}
            </div>

            <div>Zona: {ticket.category}</div>
            <div>
              Cijena: {ticket.price} <small>BAM</small>
            </div>
            <div>
              {ticket.owner !== " " && ticket.owner
                ? `Vlasnik: ${ticket.owner}`
                : ""}
            </div>
            <div>
              {ticket.sent_on_email ? `Email: ${ticket.sent_on_email}` : ""}
            </div>
            <div>
              Validna:{" "}
              {ticket.isValid ? (
                <img src={check} alt="check" />
              ) : (
                <img src={X} alt="X" />
              )}
            </div>
            <button
              className="ticket-finder"
              onClick={() => toggleTicketValidity(ticket)} // Ispravljeno ovdje
            >
              {ticket.isValid ? "Obriši" : "Validiraj"}
            </button>
          </div>
        ))}
    </div>
  );
};

export default TicketSearch;
