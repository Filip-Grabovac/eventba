import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchInput = ({ setEvents, setCategory }) => {
  const [searchValue, setSearchValue] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // Fetch events based on search value
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/search/${searchValue}`
        );
        setEvents(response.data);
        setLoader(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (searchValue) {
      setCategory(null);
      fetchEvents();
    } else {
      if (!document.querySelector('.searchActive')) {
        document.querySelector('.suggested-search-link').click();
      }
      setLoader(false);
    }
  }, [searchValue]);

  return (
    <div className="nav-search-wrapper">
      <form>
        <input
          type="text"
          placeholder="Pretražite..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setLoader(true);
          }}
        />
      </form>
      {loader ? <span className="loader"></span> : ''}
    </div>
  );
};

export default SearchInput;
