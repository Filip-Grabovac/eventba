import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

const TicketCategories = ({
  freeSaleData,
  dropdown,
  dropdownHeight,
  dropdownRef,
  userData,
  concertId,
}) => {
  const [ticketInputs, setTicketInputs] = useState({});

  const handleInputChange = (categoryKey, amount) => {
    setTicketInputs((prevInputs) => ({
      ...prevInputs,
      [categoryKey]: amount,
    }));
  };

  const handleSaveChanges = async () => {
    // Check if the number of loaned tickets exceeds the available tickets
    for (const categoryKey in ticketInputs) {
      const category = freeSaleData.type[categoryKey];
      const availableTickets = category.amount - category.loaned;
      const loanedTickets = parseInt(ticketInputs[categoryKey]);

      if (loanedTickets > availableTickets) {
        toast.warning(
          `Nema dovoljno ulaznica kategorije "${category.name}" za dodijeliti u najam.`,
          toastSetup('top-right', 3000)
        );
        return; // Stop further processing if any category has more loaned tickets than available
      }
    }

    try {
      // Send the POST request using Axios and wait for the response

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/freeSale/loan-tickets`,
        { ticketInputs, userData, concertId }
      );

      toast.success(res.data.success, toastSetup('top-right', 3000));
    } catch (error) {
      // Handle any errors that occurred during the request
      toast.error(
        'Problem s dodjelom ulaznica, pokušajte kasnije...',
        toastSetup('top-right', 3000)
      );
    }
  };

  return (
    <div
      style={{ maxHeight: dropdown ? dropdownHeight + 20 : 0 }}
      className="myevents-card-dropdown resellers-list-dropdown"
      ref={dropdownRef}
    >
      {Object.keys(freeSaleData.type).map((categoryKey) => {
        const category = freeSaleData.type[categoryKey];
        const availableTickets = category.amount - category.loaned;
        const isSoldOut = availableTickets <= 0;

        return (
          <div
            key={categoryKey}
            className={`add-reseller-dropdown-part ${
              isSoldOut ? 'sold-out' : ''
            }`}
          >
            <div>
              <p>
                {categoryKey} - {category.name}
              </p>
            </div>
            <div>
              <p>Broj ulaznica</p>
              <input
                type="text"
                placeholder={
                  isSoldOut ? 'Nedostupno' : `Dostupno: ${availableTickets}`
                }
                value={ticketInputs[categoryKey] || ''}
                onChange={(e) => handleInputChange(categoryKey, e.target.value)}
                disabled={isSoldOut}
              />
            </div>
          </div>
        );
      })}
      <button className="add-reseller" onClick={handleSaveChanges}>
        Dodijeli ulaznice
      </button>
    </div>
  );
};

export default TicketCategories;
