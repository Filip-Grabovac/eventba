import React from 'react';

export const SellingInfo = ({ data }) => {
  return (
    <div className="resellers-card-bottom-row">
      <div>
        <p>{data.reseller}</p>
      </div>
      <div>
        <span>{data.date}</span>
      </div>
      <div>
        <p>Preuzeo: {data.taker}</p>
        <p>{data.price} BAM</p>
      </div>
    </div>
  );
};
