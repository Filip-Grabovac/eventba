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
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/type/${category}`
        );

        setEvents(response.data);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchEvents();
  }, [category]); // Dodajte category kao ovisnost u useEffect-u

  const handleClick = (category) => {
    setCategory(category);
  };

  return (
    <div className="search-mini-nav">
      <ul className="search-nav-left">
        <li>
          <a
            className={category === "suggested" ? "active" : ""}
            onClick={() => handleClick("suggested")}
          >
            Preporuka
          </a>
        </li>
        <li>
          <a
            className={category === "concert" ? "active" : ""}
            onClick={() => handleClick("concert")}
          >
            Koncerti
          </a>
        </li>
        <li>
          <a
            className={category === "festival" ? "active" : ""}
            onClick={() => handleClick("festival")}
          >
            Festivali
          </a>
        </li>
        <li>
          <a
            className={category === "theaters" ? "active" : ""}
            onClick={() => handleClick("theaters")}
          >
            Pozorište
          </a>
        </li>
        <li>
          <a
            className={category === "show" ? "active" : ""}
            onClick={() => handleClick("show")}
          >
            Šou
          </a>
        </li>
        <li>
          <a
            className={category === "other" ? "active" : ""}
            onClick={() => handleClick("other")}
          >
            Ostalo
          </a>
        </li>
      </ul>
      <ul className="search-nav-right">
        <li>
          <SearchInput setEvents={setEvents} />
        </li>
      </ul>
    </div>
  );
};

export default MainSearchNav;
