import React, { useState } from 'react';
import MinusIcon from '../../../assets/ikonice/minus_icon.svg';
import PlusIcon from '../../../assets/ikonice/plus_icon.svg';

export const TicketManager = ({
  type,
  price,
  totalAmount,
  totalSold,
  setAvailable,
  setTotalSold,
  setTotalSoldMoney,
  setLeftMoney,
}) => {
  const [total, setTotal] = useState(totalAmount);
  const [sold, setSold] = useState(totalSold);

  const handleDecrement = () => {
    if (sold === 0) return;

    setSold((total) => --total);
    setAvailable((available) => ++available);
    setTotalSold((sold) => --sold);
    setTotalSoldMoney((sold) => sold - price);
    setLeftMoney((leftMoney) => leftMoney - price);
  };
  const handleIncrement = () => {
    if (sold === total) return;

    setSold((total) => ++total);
    setAvailable((available) => --available);
    setTotalSold((sold) => ++sold);
    setTotalSoldMoney((sold) => sold + price);
    setLeftMoney((leftMoney) => leftMoney + price);
  };

  return (
    <div className="ticket-check-part">
      <img onClick={handleDecrement} src={MinusIcon} alt="Minus" />
      <div>
        <p>{type}</p>
        <p>Cijena: {price} BAM</p>
        <p>Zaduženo: {total}</p>
        <p>Prodano: {sold}</p>
      </div>
      <img onClick={handleIncrement} src={PlusIcon} alt="Plus" />
    </div>
  );
};
