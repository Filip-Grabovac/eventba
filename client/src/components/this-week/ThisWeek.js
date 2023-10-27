import React, { useEffect, useState } from "react";
import Carousel, { consts } from "react-elastic-carousel";
import { SliderCard } from "./SliderCard";
import axios from "axios";

export const ThisWeek = (props) => {
  const [thisWeek, setThisWeekData] = useState({});
  const [suggested, setSuggested] = useState({});
  const type = props.type;

  // Slider setup
  const breakpoints = [
    { width: 200, itemsToShow: 1.2 },
    { width: 400, itemsToShow: 2 },
    { width: 1000, itemsToShow: 2.4 },
    { width: 1500, itemsToShow: 3 },
  ];

  // Fetch the data
  useEffect(() => {
    let endpoint;
    if (type)
      endpoint = `${process.env.REACT_APP_API_URL}/api/v1/concerts/type/${type}`;
    else
      endpoint = `${process.env.REACT_APP_API_URL}/api/v1/concerts/this_week/true`;

    const fetchThisWeekData = async () => {
      try {
        const response = await axios.get(endpoint);
        if (response.data.length < 1) {
          const fetchHotConcerts = async () => {
            try {
              const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/concerts/is_promoted_event/true`
              );
              setSuggested(response.data);
            } catch (error) {
              console.error("Error fetching profile data:", error);
            }
          };

          fetchHotConcerts();
        }
        setThisWeekData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchThisWeekData();
  }, []);

  return (
    <div className="this-week">
      <h3>{thisWeek && thisWeek.length < 1 ? "Promovirano" : props.heading}</h3>
      <div className="slider">
        <Carousel
          itemPosition={consts.CENTER}
          itemsToShow={3}
          enableAutoPlay={true}
          autoPlaySpeed={5000}
          pagination={false}
          breakPoints={breakpoints}
        >
          {thisWeek && thisWeek.length < 1
            ? suggested &&
              Array.isArray(suggested) &&
              suggested.map((item, i) => <SliderCard key={i} data={item} />)
            : thisWeek &&
              Array.isArray(thisWeek) &&
              thisWeek.map((item, i) => <SliderCard key={i} data={item} />)}
        </Carousel>
      </div>
    </div>
  );
};
