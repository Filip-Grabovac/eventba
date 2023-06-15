import React from "react";
import SearchInput from "../../hero/mainSearch/SearchInput";

const MainSearchNav = () => {
  return (
    <div className="search-mini-nav">
      <ul className="search-nav-left">
        <li>
          <a href="#">Preporuka</a>
        </li>
        <li>
          <a href="#">Koncerti</a>
        </li>
        <li>
          <a href="#">Festivali</a>
        </li>
        <li>
          <a href="#">Pozorište</a>
        </li>
        <li>
          <a href="#">Šou</a>
        </li>
        <li>
          <a href="#">Ostalo</a>
        </li>
      </ul>
      <ul className="search-nav-right">
        <li>
          <SearchInput />
        </li>
      </ul>
    </div>
  );
};

export default MainSearchNav;
