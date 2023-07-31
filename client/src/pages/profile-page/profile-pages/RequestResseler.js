import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const RequestReseller = ({ profileData }) => {
  const userId = useSelector((state) => state.userState.user);
  const [isSent, setIsSent] = useState(
    profileData.reseller_info ? true : false
  );

  // Submit data for reseller
  async function handleFormSubmit(e) {
    e.preventDefault();
    let counter = 0;

    // Gather all form data
    const formData = {
      sellingPlaceName: e.target.elements.selling_place_name.value,
      sellingPlaceAddress: e.target.elements.selling_place_address.value,
      sellingPlaceNumber: e.target.elements.selling_place_number.value,
    };

    document.querySelectorAll('.reseller-input').forEach((e, i) => {
      if (e.value === '') {
        e.style = 'outline: 2px solid #f4cd46;';

        counter++;
      }
    });

    if (counter === 0) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL +
            `/api/v1/users/create_reseller/${userId}`,
          formData
        );

        toast.success(response.data.message, toastSetup('top-right', 3000));
        setIsSent(true);
        document.querySelectorAll('.reseller-input').forEach((e, i) => {
          e.value = '';
        });
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    } else {
      toast.warn('Popunite sva polja.', toastSetup('top-right', 3000));
    }
  }

  return (
    <div className="request-resseler-container">
      {isSent ? (
        <p className="reseller-request-msg">
          Zahtjev je poslan i biti će pregledan.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            handleFormSubmit(e);
          }}
        >
          <input
            className="reseller-input"
            name="selling_place_name"
            type="text"
            placeholder="Naziv prodajnog mjesta"
            onInput={(e) => {
              e.target.style = 'outline: none;';
            }}
          />
          <input
            className="reseller-input"
            name="selling_place_address"
            type="text"
            placeholder="Adresa prodajnog mjesta"
            onInput={(e) => {
              e.target.style = 'outline: none;';
            }}
          />
          <input
            className="reseller-input"
            name="selling_place_number"
            type="text"
            placeholder="Telefon prodajnog mjesta"
            onInput={(e) => {
              e.target.style = 'outline: none;';
            }}
          />
          <button type="submit">Pošalji</button>
          <p>
            Nakon što pošaljete zahtjev za preprodavača, admin će obraditi vaš
            zahtjev
          </p>
        </form>
      )}
    </div>
  );
};
