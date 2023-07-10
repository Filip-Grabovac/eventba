import React, { useEffect, useState } from "react";
import MainSearchNav from "./MainSearchNav";
import MainSearchCard from "./MainSearchCard";
import { HotEvents } from "../hotevents/HotEvents";
import { RotatingLines } from "react-loader-spinner";

const MainSearch = () => {
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(true);
  //Animation for showing cards
  const [show, setShow] = useState(false);

  // Loading events with opacity from 0-1
  useEffect(() => {
    setShow(false);
    if (events.length > 0) {
      setLoader(false);
      setTimeout(() => {
        setShow(true);
      }, 200); // Promijeni vrijeme prema potrebama
    }
  }, [events]);

  console.log(events);

  return (
    <div className="container-fluid main-search-container">
      <div className="row">
        <div className="col-lg-9">
          <MainSearchNav setEvents={setEvents} setLoader={setLoader} />
          <div className="loader">
            <RotatingLines
              strokeColor="#455cd9"
              strokeWidth="4"
              animationDuration="0.5"
              width="96"
              visible={loader}
            />
          </div>
          <div
            className={`fade-in search-cards-container ${show ? "show" : ""}`}
          >
            {events.length > 0 ? (
              events.map((event) => (
                <MainSearchCard key={event._id} event={event} />
              ))
            ) : (
              <p>Nema dostupnih događaja.</p>
            )}
          </div>
        </div>
        <div className="col-lg-3">
          <HotEvents />
        </div>
      </div>
    </div>
  );
};

export default MainSearch;
