import React, { useEffect, useState } from "react";
import { ListPageCard } from "./ListPageCard";
import axios from "axios";
import { useLocation } from "react-router-dom";
import SearchIcon from "../../assets/ikonice/search_icon.png";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "../../functions/useDebounce";
import { Bars } from "react-loader-spinner";

export const ListPage = () => {
  const [events, setEvents] = useState([]);
  const location = useLocation();
  const typeParam = new URLSearchParams(location.search).get("type");
  const [type, setType] = useState(typeParam);
  const [searchValue, setSearchValue] = useState("");

  const [dataReady, setDataReady] = useState(false);
  const debouncedValue = useDebounce(searchValue, 400);

  useEffect(() => {
    setType(typeParam);
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, [type]);

  useEffect(() => {
    searchEvents();
  }, [debouncedValue]);

  async function fetchData() {
    if (!type) return;
    try {
      setDataReady(false);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/type/${type}`
      );
      setEvents(response.data);
      setDataReady(true);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  }

  async function searchEvents() {
    setDataReady(false);
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          `/api/v1/concerts/${searchValue === "" ? "type" : "search"}/${type}${
            searchValue === "" ? "" : "/"
          }${searchValue}`
      );

      // Postavi podatke i označi ih kao spremne
      setEvents(response.data);
      setDataReady(true);
    } catch (error) {
      console.error("Error fetching event data:", error);
      // Ako dođe do pogreške, također označi podatke kao spremne kako bi izbjegli "blink"
      setDataReady(true);
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.2, // Add stagger for smoother appearance
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }, // Exit animation
  };

  return (
    <div className="list-page-container">
      <div className="list-page-search-wrapper">
        {dataReady ? (
          <motion.img
            onClick={() => {
              searchEvents();
            }}
            src={SearchIcon}
            alt="Search"
          />
        ) : (
          <motion.div>
            <Bars
              height="20"
              width="20"
              color="#455cd9"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass="mini-loader"
            />
          </motion.div>
        )}
        <input
          className="list-page-search"
          type="text"
          placeholder="Pretraži"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      <div className="search-overlay"></div>
      {dataReady && (
        <AnimatePresence>
          {events.length > 0 ? (
            <motion.div
              key="events-container"
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="search-cards-container"
            >
              {events.map((event, i) => (
                <motion.div key={event._id} variants={item}>
                  <motion.div
                    variants={item}
                    className="list-page-card-wrapper "
                  >
                    <div className="card-transition"></div>
                    <ListPageCard data={event} />
                    <div className="card-transition"></div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.h6
              key="no-events-message"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                margin: "50px auto",
                display: "block",
                width: "fit-content",
              }}
            >
              Trenutno nema događaja tog tipa
            </motion.h6>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
