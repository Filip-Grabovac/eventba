import React, { useState } from "react";
import MinusIcon from "../../../assets/ikonice/minus_icon.svg";
import PlusIcon from "../../../assets/ikonice/plus_icon.svg";
import axios from "axios";

export const TicketManager = ({
  type,
  price,
  totalAmount,
  totalSold,
  setAvailable,
  setTotalSold,
  setTotalSoldMoney,
  setLeftMoney,
  concertId,
  resellerId,
}) => {
  const [total, setTotal] = useState(totalAmount);
  const [sold, setSold] = useState(totalSold);
  const [decrementStatus, setDecrementStatus] = useState(true);
  const [incrementStatus, setIncrementStatus] = useState(true);

  async function updateData(data) {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `/api/v1/concerts/update/${concertId}`,
        data
      );
    } catch (error) {}
  }

  const handleDecrement = () => {
    setIncrementStatus(true);

    if (sold === 0) {
      setDecrementStatus(false);
      return;
    }
    let data = {
      total_amount: "+",
      price: price,
      reseller_id: resellerId,
      category_name: type,
    };

    setSold((total) => --total);
    setAvailable((available) => ++available);
    setTotalSold((sold) => --sold);
    setTotalSoldMoney((sold) => sold - price);
    setLeftMoney((leftMoney) => leftMoney - price);
    updateData(data);
  };
  const handleIncrement = () => {
    setDecrementStatus(true);

    if (sold === total) {
      setIncrementStatus(false);
      return;
    }
    let data = {
      total_amount: "-",
      price: price,
      reseller_id: resellerId,
      category_name: type,
    };

    setSold((total) => ++total);
    setAvailable((available) => --available);
    setTotalSold((sold) => ++sold);
    setTotalSoldMoney((sold) => sold + price);
    setLeftMoney((leftMoney) => leftMoney + price);
    updateData(data);
  };

  return (
    <div className="ticket-check-part">
      <img
        onClick={() => {
          if (decrementStatus) {
            handleDecrement();
          }
        }}
        src={MinusIcon}
        alt="Minus"
      />
      <div>
        <p>{type}</p>
        <p>
          Cijena: {price} <small>BAM</small>
        </p>
        <p>Zaduženo: {total}</p>
        <p>Prodano: {sold}</p>
      </div>
      <img
        onClick={() => {
          if (incrementStatus) {
            handleIncrement();
          }
        }}
        src={PlusIcon}
        alt="Plus"
      />
    </div>
  );
};
