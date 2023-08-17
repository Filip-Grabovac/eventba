import React, { useEffect, useState } from 'react';
import { ListPageCard } from './ListPageCard';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import SearchIcon from '../../assets/ikonice/search_icon.png';

export const ListPage = () => {
  const [events, setEvents] = useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type');
  const [type, setType] = useState(typeParam);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    setType(typeParam);
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, [type]);

  async function fetchData() {
    if (!type) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/type/${type}`
      );
      setEvents(response.data);
      setDataReady(false); // Reset data readiness before fetching
      setTimeout(() => {
        setDataReady(true); // Set dataReady to true after a short delay
      }, 50); // You can adjust the delay time as needed
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }

  // Search with enter
  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      searchEvents();
    }
  }

  function searchEvents() {
    const searchValue = document.querySelector('.list-page-search').value;
    setEvents([]);
    setDataReady(false); // Reset data readiness before fetching

    axios
      .get(
        process.env.REACT_APP_API_URL +
          `/api/v1/concerts/${searchValue === '' ? 'type' : 'search'}/${type}${
            searchValue === '' ? '' : '/'
          }${searchValue}`
      )
      .then((response) => {
        setEvents(response.data);
        setDataReady(false); // Reset dataReady before showing the results
        setTimeout(() => {
          setDataReady(true); // Set dataReady to true after a short delay
        }, 50); // You can adjust the delay time as needed
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
      <div className="search-overlay"></div>
      <div className="card-transition"></div>
      {!events
        ? Array.from({ length: 4 }, (_, index) => (
            <div className="skeleton" key={index}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ))
        : events.map((e, i) => (
            <div
              className={`list-page-card-wrapper fade-in ${
                dataReady ? 'visible' : ''
              }`}
              key={i}
            >
              <ListPageCard data={e} />
              <div
                className={`card-transition fade-in ${
                  dataReady ? 'visible' : ''
                }`}
              ></div>
            </div>
          ))}
      <ListPageCard />
    </div>
  );
};
