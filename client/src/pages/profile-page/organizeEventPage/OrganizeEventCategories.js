import React from "react";

export const OrganizeEventCategories = ({
  index,
  inputName,
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
    <div className="organize-middle-part" style={{ gap: "20px" }}>
      <input
        name={`ticketName-${index}`}
        type="text"
        className="location-input event-input"
        placeholder="Naziv kategorije"
        value={inputName !== undefined ? inputName : zoneName}
        onChange={(e) => handleTicketInputChange(index, "name", e.target.value)}
      />
      <input
        name={`ticketAmount-${index}`}
        type="number"
        min="0"
        className="location-input event-input"
        placeholder="Ukupan broj ulaznica"
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
        placeholder="Cijena ulaznice"
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
      />
    </div>
  );
};
