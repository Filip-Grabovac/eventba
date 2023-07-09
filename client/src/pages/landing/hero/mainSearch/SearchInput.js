import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchInput = ({ setEvents }) => {
  const [searchValue, setSearchValue] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/search/${searchValue}`
        );

        setEvents(response.data);
        console.log("Pretraga");
        setLoader(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (searchValue) {
      setLoader(true);
      fetchEvents();
    }
  }, [searchValue, setEvents]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Provjerite valjanost unosa ili dodajte dodatne provjere prema potrebi
    if (searchValue.trim() !== "") {
      setLoader(true);
    }
  };

  return (
    <div className="nav-search-wrapper">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pretražite..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchInput;
