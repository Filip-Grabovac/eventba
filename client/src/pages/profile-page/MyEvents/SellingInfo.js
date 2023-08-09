import React from "react";
import { hrTimeFormatShort } from "../../../components/helper/timeFormatShort";
import check from "../../../assets/ikonice/check2_icon.svg";
import x from "../../../assets/ikonice/not_verified.svg";

export const SellingInfo = ({ data }) => {
  const formattedDate = new Date(data && data.date).toLocaleDateString(
    "hr-HR",
    hrTimeFormatShort
  );

  if (!data) return;
  return (
    <div className="resellers-card-bottom-row">
      <div>
        <p>{data.reseller}</p>
      </div>
      <div>
        <span>{formattedDate}</span>
      </div>
      <div>
        <p>Preuzeo: {data.taker}</p>
        <p>
          {data.price} <small>BAM</small>
        </p>

        <img src={data.is_verified ? check : x} alt="check or X" />
      </div>
    </div>
  );
};
