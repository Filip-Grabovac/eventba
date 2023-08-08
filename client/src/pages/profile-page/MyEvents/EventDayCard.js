import React, { useEffect, useState } from 'react';
import PlusIcon from '../../../assets/ikonice/plus_icon.svg';
import { AddPayment } from './AddPayment';
import { SellingInfo } from './SellingInfo';

export const EventDayCard = ({ setMarginB, iterator, data, concertId }) => {
  const [addedInputs, setAddedInputs] = useState(0);
  const [sellingInfo, setSellingInfo] = useState();

  useEffect(() => {
    setSellingInfo(data.transactions);
  }, []);

  console.log(sellingInfo);

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
        <div>
          {Object.entries(data.type).map(([categoryName, categoryData]) => {
            return (
              <div key={categoryName}>
                <p>{categoryName}</p>
                <p>
                  Prodano: {categoryData.sold}/{categoryData.loaned}
                </p>
                <p>Cijena: {categoryData.price} BAM</p>
              </div>
            );
          })}
        </div>
        <div>
          <p>Prodano ulaznica: 132</p>
          <p>Ukupno: 132 BAM</p>
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
        <p>Preostalo: 10 BAM</p>
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
