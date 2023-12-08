import React, { useState } from "react";
import MainSearchNav from "./MainSearchNav";
import MainSearchCard from "./MainSearchCard";
import { HotEvents } from "../hotevents/HotEvents";
import { Bars } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";

const MainSearch = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Učitavanje događaja s postupnim pojavljivanjem
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5, // Povećali smo trajanje prijelaza za glatkiji izgled
        delayChildren: 0.2,
        staggerChildren: 0.2, // Dodali smo zakasnjelo prikazivanje djece
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5, // Povećali smo trajanje prijelaza za glatkiji izlaz
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="container-fluid main-search-container">
      <div className="row">
        <div className="col-lg-9">
          <MainSearchNav setEvents={setEvents} setIsLoading={setIsLoading} />
          <AnimatePresence>
            <motion.div
              key="search-cards-container"
              variants={item}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="search-cards-container"
            >
              {isLoading ? (
                <Bars
                  height="80"
                  width="80"
                  color="#455cd9"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass="loader"
                />
              ) : (
                <motion.div
                  key="search-cards-container"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  {events.length > 0 ? (
                    events.map((event) => (
                      <motion.div key={event._id} variants={item} exit="hidden">
                        <MainSearchCard event={event} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.h6
                      key="no-events"
                      style={{ textAlign: "center" }}
                      variants={item}
                      exit="hidden"
                    >
                      Nema dostupnih događaja.
                    </motion.h6>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="col-lg-3">
          <HotEvents />
        </div>
      </div>
    </div>
  );
};

export default MainSearch;
