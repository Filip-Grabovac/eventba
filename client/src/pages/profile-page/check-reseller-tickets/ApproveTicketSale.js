import React, { useState } from 'react';
import CheckIcon from '../../../assets/ikonice/check2_icon.svg';

export const ApproveTicketSale = ({ setLeftMoney }) => {
  const [isApproved, setApprovedStatus] = useState(false);
  const [price, setPrice] = useState(100);

  // Approve payment request from organizer
  function approvePaymentRequest() {
    setApprovedStatus(true);
    setLeftMoney((leftMoney) => leftMoney - price);
  }

  return (
    <div className="approve-ticket-sale">
      <div>
        <p>Kresimir Bilic</p>
      </div>
      <div>
        <span>07.kol.2023 22:00 </span>
      </div>
      <div>
        <p>Preuzeo: Anto Matić</p>
      </div>
      <div>
        <p className="price">{price}</p>
        <span>BAM</span>
        {!isApproved ? (
          <a
            onClick={() => {
              approvePaymentRequest();
            }}
            href="#"
          >
            Potvrdi
          </a>
        ) : (
          <img src={CheckIcon} alt="Check"></img>
        )}
      </div>
    </div>
  );
};
