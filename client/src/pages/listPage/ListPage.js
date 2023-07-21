import React, { useEffect, useState } from "react";
import { ListPageCard } from "./ListPageCard";
import axios from "axios";
import { useLocation } from "react-router-dom";
import SearchIcon from "../../assets/ikonice/search_icon.png";

export const ListPage = () => {
  const [events, setEvents] = useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get("type");
  const [type, setType] = useState(typeParam);

  useEffect(() => {
    setEvents();
    setType(typeParam);
  }, [location.search]);

  // Fetch the events
  useEffect(() => {
    if (!type) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/concerts/type/${type}`
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, [type]);

  // Search with enter
  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      searchEvents();
    }
  }

  // Search events
  function searchEvents() {
    const searchValue = document.querySelector(".list-page-search").value;
    setEvents();

    axios
      .get(
        process.env.REACT_APP_API_URL +
          `/api/v1/concerts/${searchValue === "" ? "type" : "search"}/${type}${
            searchValue === "" ? "" : "/"
          }${searchValue}`
      )
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {});
  }

  return (
    <div className="list-page-container">
      <div className="list-page-search-wrapper">
        <img
          onClick={() => {
            searchEvents();
          }}
          src={SearchIcon}
          alt="Search"
        />
        <input
          className="list-page-search"
          type="text"
          placeholder="Pretraži"
          onKeyUp={(e) => {
            handleKeyPress(e);
          }}
        />
      </div>
      {events ? <div className="search-overlay"></div> : ""}
      {events ? <div className="card-transition"></div> : ""}
      {events && events[0] === undefined ? (
        <p className="no-search-results">Nema rezultata</p>
      ) : (
        ""
      )}

      {!events
        ? Array.from({ length: 7 }, (_, index) => (
            <div className="skeleton" key={index}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ))
        : events.map((e, i) => (
            <div className="list-page-card-wrapper" key={i}>
              <ListPageCard data={e} />
              <div className="card-transition"></div>
            </div>
          ))}
      <ListPageCard />
    </div>
  );
};
