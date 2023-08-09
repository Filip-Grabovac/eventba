import React, { useState } from "react";
import CheckIcon from "../../../assets/ikonice/check2_icon.svg";
import { hrTimeFormatShort } from "../../../components/helper/timeFormatShort";
import axios from "axios";

export const ApproveTicketSale = ({
  setLeftMoney,
  transactions,
  i,
  resellerId,
  concertId,
}) => {
  const { reseller, taker, price, is_verified, date } = transactions;

  const [isApproved, setApprovedStatus] = useState(is_verified);

  // Approve payment request from organizer
  async function approvePaymentRequest(e) {
    e.preventDefault();
    try {
      console.log({
        transactionIndex: i,
        concertId,
        resellerId,
      });
      const responese = await axios.post(
        process.env.REACT_APP_API_URL + "/api/v1/freeSale/verify-transaction",
        {
          transactionIndex: i,
          concertId,
          resellerId,
        }
      );
      console.log(responese.data);
    } catch (error) {
      console.error(error);
    }
    setApprovedStatus(true);
    setLeftMoney((leftMoney) => leftMoney - price);
  }
  const formattedDate = new Date(date).toLocaleDateString(
    "hr-HR",
    hrTimeFormatShort
  );
  return (
    <div className="approve-ticket-sale">
      <div>
        <p>{reseller}</p>
      </div>
      <div>
        <span>{formattedDate}</span>
      </div>
      <div>
        <p>Preuzeo: {taker}</p>
      </div>
      <div>
        <p className="price">{price}</p>
        <span>
          <small>BAM</small>
        </span>
        {!isApproved ? (
          <a
            onClick={(e) => {
              approvePaymentRequest(e);
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
