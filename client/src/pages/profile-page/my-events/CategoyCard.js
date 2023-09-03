import React from "react";

const CategoryCard = ({ amount, max_amount, price, name, categoryName }) => {
  return (
    <div className="category-card">
      <strong>
        {categoryName} {name && `- ${name}`}
      </strong>
      <span>
        Prodano: {max_amount ? max_amount - amount : "Nije u prodaji"}
      </span>
      <span>
        Ukupno: {max_amount ? price * (max_amount - amount) : "--,--"}{" "}
        <small>BAM</small>
      </span>
    </div>
  );
};

export default CategoryCard;
