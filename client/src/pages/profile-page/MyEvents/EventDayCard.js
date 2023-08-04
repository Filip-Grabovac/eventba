import React from 'react';
import PlusIcon from '../../../assets/ikonice/plus_icon.svg';

export const EventDayCard = () => {
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
      <div className="resellers-card-bottom-row">
        <div>
          <p>Filip Grabovac</p>
        </div>
        <div>
          <span>07.kol.2023 22:00 </span>
        </div>
        <div>
          <p>Preuzeo: Ivica Džambas</p>
          <p>22 BAM</p>
        </div>
      </div>
      <div className="resellers-card-last-row">
        <p>Preostalo: 10 BAM</p>
        <img className="plus-icon" src={PlusIcon} alt="Plus" />
      </div>
    </div>
  );
};
