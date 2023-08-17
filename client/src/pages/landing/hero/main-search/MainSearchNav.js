import React, { useEffect, useState } from 'react';
import SearchInput from '../../hero/main-search/SearchInput';
import axios from 'axios';
import { SearchNavLink } from './SearchNavLink';

const MainSearchNav = ({ setEvents, setLoader }) => {
  const [category, setCategory] = useState('suggested');

  useEffect(() => {
    setEvents([]);
    setLoader(true);

    // Fetch the searched events
    const fetchEvents = async () => {
      try {
        if (category) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/concerts/type/${category}`
          );

          setEvents(response.data);
        }
        setLoader(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchEvents();
  }, [category]);

  // Set active link
  const handleClick = (category) => {
    setCategory(category);
  };

  return (
    <div className="search-mini-nav">
      <ul className="search-nav-left">
        <SearchNavLink
          isActive={category === 'suggested' ? 'searchActive' : ''}
          handleClick={handleClick}
          content="Preporuka"
          category="suggested"
        />
        <SearchNavLink
          isActive={category === 'concert' ? 'searchActive' : ''}
          handleClick={handleClick}
          content="Koncerti"
          category="concert"
        />
        <SearchNavLink
          isActive={category === 'festival' ? 'searchActive' : ''}
          handleClick={handleClick}
          content="Festivali"
          category="festival"
        />
        <SearchNavLink
          isActive={category === 'sport' ? 'searchActive' : ''}
          handleClick={handleClick}
          content="Sport"
          category="sport"
        />
        <SearchNavLink
          isActive={category === 'theaters' ? 'searchActive' : ''}
          handleClick={handleClick}
          content="Predstave"
          category="theaters"
        />

        <SearchNavLink
          isActive={category === 'other' ? 'searchActive' : ''}
          handleClick={handleClick}
          content="Ostalo"
          category="other"
        />
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
