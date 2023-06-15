import React from "react";
import SearchIcon from "../../../../assets/ikonice/search_icon.png";

const SearchInput = () => {
  return (
    <div className="nav-search-wrapper">
      <input type="text" placeholder="Pretražite..." />
      <img src={SearchIcon} alt="Search Icon" />
    </div>
  );
};

export default SearchInput;
