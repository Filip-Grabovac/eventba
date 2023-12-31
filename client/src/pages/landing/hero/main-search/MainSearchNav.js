import React, { useEffect, useState } from "react";
import SearchInput from "../../hero/main-search/SearchInput";
import axios from "axios";
import { SearchNavLink } from "./SearchNavLink";
import sortByTime from "../../../../functions/sortByTimeOfEvent";

const MainSearchNav = ({ setEvents, setIsLoading }) => {
  const [category, setCategory] = useState("suggested");

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      if (category) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/type/${category}`
        );

        setEvents(sortByTime(response.data));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
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
          isActive={category === "suggested" ? "searchActive" : ""}
          handleClick={handleClick}
          content="Preporuka"
          category="suggested"
        />
        <SearchNavLink
          isActive={category === "concert" ? "searchActive" : ""}
          handleClick={handleClick}
          content="Koncerti"
          category="concert"
        />
        <SearchNavLink
          isActive={category === "festival" ? "searchActive" : ""}
          handleClick={handleClick}
          content="Festivali"
          category="festival"
        />
        <SearchNavLink
          isActive={category === "sport" ? "searchActive" : ""}
          handleClick={handleClick}
          content="Sport"
          category="sport"
        />
        <SearchNavLink
          isActive={category === "theaters" ? "searchActive" : ""}
          handleClick={handleClick}
          content="Predstave"
          category="theaters"
        />

        <SearchNavLink
          isActive={category === "other" ? "searchActive" : ""}
          handleClick={handleClick}
          content="Ostalo"
          category="other"
        />
      </ul>
      <ul className="search-nav-right">
        <li>
          <SearchInput
            setEvents={setEvents}
            setCategory={setCategory}
            setIsLoading={setIsLoading}
          />
        </li>
      </ul>
    </div>
  );
};

export default MainSearchNav;
