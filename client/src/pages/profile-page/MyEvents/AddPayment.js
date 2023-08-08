import React, { useState } from 'react';
import { hrTimeFormat } from '../../../components/helper/timeFormat';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const AddPayment = ({ setSellingInfo, i }) => {
  const date = new Date().toLocaleDateString('hr-HR', hrTimeFormat);
  const [isSellingInfoAdded, setSellingStatus] = useState(false);

  function handleFormSubmit(e) {
    e.preventDefault();

    let counter = 0;
    const formData = new FormData(e.target);
    const sellerName = formData.get('sellerName');
    const taker = formData.get('taker');
    const amount = formData.get('amount');

    const newDataObject = {
      reseller: sellerName,
      date: `${date}`,
      taker: taker,
      price: amount,
    };

    document.querySelectorAll(`.selling-info-input${i}`).forEach((e, i) => {
      if (e.value === '') {
        e.style = 'outline: 2px solid #f4cd46;';
        counter++;
      }
    });

    // Display different errors
    if (counter > 0) {
      toast.warn('Molimo unesite sva polja', toastSetup('top-right', 3000));
    } else {
      setSellingStatus(true);
      setSellingInfo((prevSellingInfo) => [...prevSellingInfo, newDataObject]);
      toast.success('Uspješno dodano.', toastSetup('top-right', 3000));
    }
  }

  if (isSellingInfoAdded) return;
  return (
    <form
      onSubmit={(e) => {
        handleFormSubmit(e);
      }}
      className="add-payment-wrapper"
    >
      <div className="input-row">
        <input
          type="text"
          className={`selling-info-input${i}`}
          name="sellerName"
          placeholder="Ime prodavača"
          onInput={(e) => {
            e.target.style = 'outline: none;';
          }}
        />
        <input
          disabled
          defaultValue={date}
          type="text"
          className={`selling-info-input`}
          name="date"
          placeholder="datum"
        />
        <input
          type="text"
          className={`selling-info-input${i}`}
          name="taker"
          placeholder="Preuzeo"
          onInput={(e) => {
            e.target.style = 'outline: none;';
          }}
        />
        <input
          type="number"
          className={`selling-info-input${i}`}
          name="amount"
          placeholder="Iznos"
          onInput={(e) => {
            e.target.style = 'outline: none;';
          }}
        />
      </div>
      <div className="input-row">
        <button type="submit">Dodaj</button>
      </div>
    </form>
  );
};
