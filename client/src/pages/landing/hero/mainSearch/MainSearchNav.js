import React, { useEffect, useState } from "react";
import SearchInput from "../../hero/mainSearch/SearchInput";
import axios from "axios";

const MainSearchNav = ({ setEvents, setLoader }) => {
  // Dodajte vitičaste zagrade za destrukturiranje props-a
  const [category, setCategory] = useState("suggested");

  useEffect(() => {
    setEvents([]);
    setLoader(true);

    const fetchEvents = async () => {
      try {
        if (category) {
          // Provjerite da li category ima vrijednost
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/concerts/type/${category}`
          );

          setEvents(response.data);
        }
        setLoader(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchEvents();
  }, [category]);

  const handleClick = (category) => {
    setCategory(category);
  };

  return (
    <div className="search-mini-nav">
      <ul className="search-nav-left">
        <li>
          <a
            className={`${
              category === "suggested" ? "searchActive" : ""
            } suggested-search-link`}
            onClick={() => handleClick("suggested")}
          >
            Preporuka
          </a>
        </li>
        <li>
          <a
            className={category === "concert" ? "searchActive" : ""}
            onClick={() => handleClick("concert")}
          >
            Koncerti
          </a>
        </li>
        <li>
          <a
            className={category === "festival" ? "searchActive" : ""}
            onClick={() => handleClick("festival")}
          >
            Festivali
          </a>
        </li>
        <li>
          <a
            className={category === "theaters" ? "searchActive" : ""}
            onClick={() => handleClick("theaters")}
          >
            Pozorište
          </a>
        </li>
        <li>
          <a
            className={category === "show" ? "searchActive" : ""}
            onClick={() => handleClick("show")}
          >
            Šou
          </a>
        </li>
        <li>
          <a
            className={category === "other" ? "searchActive" : ""}
            onClick={() => handleClick("other")}
          >
            Ostalo
          </a>
        </li>
      </ul>
      <ul className="search-nav-right">
        <li>
          <SearchInput setEvents={setEvents} setCategory={setCategory} />
        </li>
      </ul>
    </div>
  );
};

export default MainSearchNav;
