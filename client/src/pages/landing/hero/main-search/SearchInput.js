import React, { useState, useEffect } from "react";
import axios from "axios";
import useDebounce from "../../../../functions/useDebounce";

const SearchInput = ({ setEvents, setCategory, setIsLoading }) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    // Fetch events based on search value
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/search/${searchValue}`
        );
        setEvents(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (searchValue) {
      setCategory(null);
      fetchEvents();
    } else {
      if (!document.querySelector(".searchActive")) {
        document.querySelector(".suggested-search-link").click();
      }
      setIsLoading(false);
    }
  }, [debouncedValue]);

  return (
    <div className="nav-search-wrapper">
      <form>
        <input
          type="text"
          placeholder="Pretražite..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsLoading(true);
          }}
        />
      </form>
    </div>
  );
};

export default SearchInput;
