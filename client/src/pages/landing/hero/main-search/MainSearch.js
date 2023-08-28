import React, { useEffect, useState } from "react";
import MainSearchNav from "./MainSearchNav";
import MainSearchCard from "./MainSearchCard";
import { HotEvents } from "../hotevents/HotEvents";
import { Bars } from "react-loader-spinner";

const MainSearch = () => {
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(true);
  // Animacija za prikaz kartica
  const [show, setShow] = useState(false);

  // Učitavanje događaja s postupnim pojavljivanjem
  useEffect(() => {
    setShow(false);
    if (events.length > 0) {
      setLoader(false);
      setTimeout(() => {
        setShow(true);
      }, 200); // Promijenite vrijeme prema potrebama
    } else {
      // Ako nema događaja, odmah prikaži bez efekta fade-in
      setLoader(false);
      setShow(true);
    }
  }, [events]);

  return (
    <div className="container-fluid main-search-container">
      <div className="row">
        <div className="col-lg-9">
          <MainSearchNav setEvents={setEvents} setLoader={setLoader} />
          <div className="loader">
            <Bars
              height="80"
              width="80"
              color="#455cd9"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={loader}
            />
          </div>
          <div
            className={`search-cards-container fade-in ${show ? " show" : ""}`}
          >
            {events.length > 0 ? (
              events.map((event) => (
                <MainSearchCard key={event._id} event={event} />
              ))
            ) : (
              <h6>Nema dostupnih događaja.</h6>
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
