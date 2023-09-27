import React from "react";

const CategoryCard = ({ amount, max_amount, price, name, categoryName }) => {
  return (
    max_amount && (
      <div className="category-card">
        <strong>
          {categoryName} {name && `- ${name}`}
        </strong>
        <span>
          Prodano: {max_amount - amount}
          {max_amount ? ` / ${max_amount}` : null}
        </span>
        <span>
          Ukupno: {price * (max_amount - amount)} <small>BAM</small>
        </span>
      </div>
    )
  );
};

export default CategoryCard;
