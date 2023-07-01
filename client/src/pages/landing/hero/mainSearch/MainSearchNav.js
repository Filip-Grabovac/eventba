import React, { useState } from "react";
import SearchInput from "../../hero/mainSearch/SearchInput";
import axios from "axios";

const MainSearchNav = () => {
  const [activeSearchLink, setActiveSearchLink] = useState("Preporuka");

  async function searchEvent(e) {
    e.preventDefault();
    setActiveSearchLink(e.target.textContent);
    let type = e.target.getAttribute("value");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/${type}/true`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

  return (
    <div className="search-mini-nav">
      <ul className="search-nav-left">
        <li>
          <a
            className={`${
              activeSearchLink === "Preporuka" ? "active-search-link" : ""
            }`}
            value="suggested"
            onClick={(e) => {
              searchEvent(e);
            }}
            href="#"
          >
            Preporuka
          </a>
        </li>
        <li>
          <a
            className={`${
              activeSearchLink === "Koncerti" ? "active-search-link" : ""
            }`}
            onClick={(e) => {
              searchEvent(e);
            }}
            value="concert"
            href="#"
          >
            Koncerti
          </a>
        </li>
        <li>
          <a
            className={`${
              activeSearchLink === "Festivali" ? "active-search-link" : ""
            }`}
            onClick={(e) => {
              searchEvent(e);
            }}
            value="festival"
            href="#"
          >
            Festivali
          </a>
        </li>
        <li>
          <a
            className={`${
              activeSearchLink === "Pozorište" ? "active-search-link" : ""
            }`}
            onClick={(e) => {
              searchEvent(e);
            }}
            value="theaters"
            href="#"
          >
            Pozorište
          </a>
        </li>
        <li>
          <a
            className={`${
              activeSearchLink === "Šou" ? "active-search-link" : ""
            }`}
            onClick={(e) => {
              searchEvent(e);
            }}
            value="show"
            href="#"
          >
            Šou
          </a>
        </li>
        <li>
          <a
            className={`${
              activeSearchLink === "Ostalo" ? "active-search-link" : ""
            }`}
            onClick={(e) => {
              searchEvent(e);
            }}
            value="other"
            href="#"
          >
            Ostalo
          </a>
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
