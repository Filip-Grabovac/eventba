import React from "react";
import { ListPageCard } from "./ListPageCard";

export const ListPage = () => {
  return (
    <div className="list-page-container">
      <ListPageCard />
      <div className="card-transition"></div>
      <ListPageCard />
    </div>
  );
};
