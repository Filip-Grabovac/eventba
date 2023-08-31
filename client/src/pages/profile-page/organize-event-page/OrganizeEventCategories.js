import React from "react";

export const OrganizeEventCategories = ({
  index,
  inputName,
  inputType,
  zoneName,
  zoneTicket,
  inputPrice,
  inputAmount,
  setTicketInputs,
  ticketInputs,
}) => {
  const handleTicketInputChange = (index, field, value) => {
    const updatedInputs = [...ticketInputs];

    // Check if the ticket input at the specified index exists
    if (!updatedInputs[index]) {
      // If it doesn't exist, initialize it with an empty object
      updatedInputs[index] = {};
    }

    // Update the specified field of the ticket input
    updatedInputs[index][field] = value;
    setTicketInputs(updatedInputs);
  };

  return (
    ticketInputs && (
      <>
        <div className="organize-middle-part online-tickets-input">
          <input
            name={`ticketName-${index}`}
            type="text"
            className="location-input event-input"
            placeholder="Kategorija"
            value={inputName !== undefined ? inputName : zoneName}
            onChange={(e) =>
              handleTicketInputChange(index, "name", e.target.value)
            }
            style={{ borderRadius: "10px 0 0 10px" }}
          />
          <input
            name={`ticketType-${index}`}
            type="text"
            className="location-input event-input"
            placeholder="Tip"
            value={inputType !== undefined ? inputType : zoneName}
            onChange={(e) =>
              handleTicketInputChange(index, "type", e.target.value)
            }
          />
          <input
            name={`ticketAmount-${index}`}
            type="number"
            min="0"
            className="location-input event-input"
            placeholder="Ukupan broj"
            value={
              inputAmount !== undefined
                ? inputAmount
                : zoneTicket
                ? zoneTicket.amount || ""
                : ""
            }
            onChange={(e) =>
              handleTicketInputChange(index, "amount", e.target.value)
            }
          />
          <input
            name={`ticketPrice-${index}`}
            type="number"
            min="0"
            step="0.01"
            className="location-input event-input"
            placeholder="Cijena"
            value={
              inputPrice !== undefined
                ? inputPrice
                : zoneTicket
                ? zoneTicket.price || ""
                : ""
            }
            onChange={(e) =>
              handleTicketInputChange(index, "price", e.target.value)
            }
            style={{ borderRadius: "0 10px 10px 0" }}
          />
          <small>BAM</small>
        </div>
      </>
    )
  );
};
