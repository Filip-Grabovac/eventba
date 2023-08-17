import React, { useEffect, useState } from 'react';
import PlusIcon from '../../../assets/ikonice/plus_icon.svg';
import { AddPayment } from './AddPayment';
import { SellingInfo } from './SellingInfo';

export const EventDayCard = ({ setMarginB, iterator, data, concertId }) => {
  const [moneyLeft, setMoneyLeft] = useState(0);
  const [addedInputs, setAddedInputs] = useState(0);
  const [sellingInfo, setSellingInfo] = useState(data.transactions || []);
  let totalVerifiedPrice = 0;
  let soldTickets = 0;
  let soldTicketsPrice = 0;

  useEffect(() => {
    if (data.transactions && data.transactions[0] !== undefined)
      for (const transaction of data.transactions) {
        if (transaction.is_verified) {
          totalVerifiedPrice += parseFloat(transaction.price);
        }
      }
    setMoneyLeft(soldTicketsPrice - totalVerifiedPrice);
  }, []);

  const handleImageClick = () => {
    setAddedInputs(addedInputs + 1);
    setMarginB((prevMarginB) => prevMarginB + 76);
  };
  return (
    <div className="resellers-card">
      <div className="resellers-card-top-row">
        <div>
          <h6>{data.reseller_name}</h6>
          <p>{data.reseller_address}</p>
        </div>
        <div className="resellers-info">
          {Object.entries(data.type).map(([categoryName, categoryData]) => {
            soldTickets = soldTickets + categoryData.sold;
            soldTicketsPrice =
              soldTicketsPrice + categoryData.sold * categoryData.price;

            return (
              <div key={categoryName}>
                <p>{categoryData.name}</p>
                <p>
                  Prodano: {categoryData.sold}/{categoryData.loaned}
                </p>
                <p>
                  Cijena: {categoryData.price} <small>BAM</small>
                </p>
              </div>
            );
          })}
        </div>
        <div>
          <p>Prodano ulaznica: {soldTickets}</p>
          <p>
            Ukupno: {soldTicketsPrice} <small>BAM</small>
          </p>
        </div>
      </div>
      {sellingInfo &&
        sellingInfo.map((e, i) => {
          return <SellingInfo key={i} data={e} />;
        })}
      <div className="resellers-card-last-row">
        {Array.from({ length: addedInputs }, (_, i) => (
          <AddPayment
            key={i}
            i={iterator}
            setSellingInfo={setSellingInfo}
            resellerId={data.reseller_id}
            concertId={concertId}
          />
        ))}
        <p>
          Preostalo: {moneyLeft} <small>BAM</small>
        </p>
        {addedInputs === 0 ? (
          <img
            onClick={handleImageClick}
            className="plus-icon"
            src={PlusIcon}
            alt="Plus"
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
