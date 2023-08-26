import React from "react";

const CategoryCard = ({ amount, max_amount, price, name, categoryName }) => {
  return (
    <div className="category-card">
      <strong>{name !== "" ? name : categoryName}</strong>
      <span>Prodano: {max_amount - amount}</span>
      <span>
        Ukupno: {price * (max_amount - amount)} <small>BAM</small>
      </span>
    </div>
  );
};

export default CategoryCard;
