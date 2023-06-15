import React from "react";
import MainSearchNav from "./MainSearchNav";
import MainSearchCard from "./MainSearchCard";
import { HotEvents } from "../hotevents/HotEvents";

const MainSearch = () => {
  return (
    <div className="container-fluid main-search-container">
      <div className="row">
        <div className="col-lg-9">
          <MainSearchNav />
          <div className="search-cards-container">
            <MainSearchCard />
            <MainSearchCard />
            <MainSearchCard />
            <MainSearchCard />
            <MainSearchCard />
          </div>
        </div>
        <div className="col-lg-3">
          <HotEvents />
        </div>
      </div>
    </div>
  );
};

export default MainSearch;
