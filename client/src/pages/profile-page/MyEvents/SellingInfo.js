import React from 'react';
import { hrTimeFormatShort } from '../../../components/helper/timeFormatShort';

export const SellingInfo = ({ data }) => {
  const formattedDate = new Date(data && data.date).toLocaleDateString(
    'hr-HR',
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
        <p>{data.price} BAM</p>
      </div>
    </div>
  );
};
