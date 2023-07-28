import React from "react";

const CategoryCard = ({ amount, maxAmount, price, name }) => {
  return (
    <div className="category-card">
      <strong>{name}</strong>
      <span>Prodano: {maxAmount - amount}</span>
      <span>
        Ukupno: {price * (maxAmount - amount)} <small>BAM</small>
      </span>
    </div>
  );
};

export default CategoryCard;
