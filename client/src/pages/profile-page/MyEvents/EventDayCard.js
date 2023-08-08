import React, { useState } from 'react';
import PlusIcon from '../../../assets/ikonice/plus_icon.svg';
import { AddPayment } from './AddPayment';
import { SellingInfo } from './SellingInfo';

export const EventDayCard = ({ setMarginB, iterator }) => {
  const [addedInputs, setAddedInputs] = useState(0);
  const [sellingInfo, setSellingInfo] = useState([
    {
      reseller: 'Filip',
      date: '07.kol.2023 22:00',
      taker: 'Ivica Dzambas',
      price: 22,
    },
  ]);

  const handleImageClick = () => {
    setAddedInputs(addedInputs + 1);
    setMarginB((prevMarginB) => prevMarginB + 76);
  };

  return (
    <div className="resellers-card">
      <div className="resellers-card-top-row">
        <div>
          <h6>Caffe Avatar</h6>
          <p>Gornji Vakuf-Uskoplje Bosna i Hercegovina</p>
        </div>
        <div>
          <div>
            <p>Parter</p>
            <p>Prodano: 30/100</p>
            <p>Cijena: 300 BAM</p>
          </div>
          <div>
            <p>Tribina</p>
            <p>Prodano: 30/100</p>
            <p>Cijena: 300 BAM</p>
          </div>
          <div>
            <p>VIP</p>
            <p>Prodano: 30/100</p>
            <p>Cijena: 300 BAM</p>
          </div>
        </div>
        <div>
          <p>Prodano ulaznica: 132</p>
          <p>Ukupno: 132 BAM</p>
        </div>
      </div>
      {sellingInfo.map((e, i) => {
        return <SellingInfo key={i} data={e} />;
      })}
      <div className="resellers-card-last-row">
        {Array.from({ length: addedInputs }, (_, i) => (
          <AddPayment key={i} i={iterator} setSellingInfo={setSellingInfo} />
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
