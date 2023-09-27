import React, { useEffect, useState } from "react";
import { GetAllEvents } from "../add-tickets/GetAllEvents";
import { useSelector } from "react-redux";
import axios from "axios";
import { EventDetails } from "../add-tickets/EventDetails";
import { ProfileTopPart } from "../user-manager/ProfileTopPart";
import { AddResellerCard } from "./AddResellerCard";
import ConcertComponent from "./ConcertComponent";
import filterByTime from "../../../functions/filterByTime";
import sortByTime from "../../../functions/sortByTimeOfEvent";

export const AddReseller = ({ resellers }) => {
  const userId = useSelector((state) => state.userState.user);
  const [allEvents, setAllEvents] = useState([]);
  const [event, setEvent] = useState("");
  const [concertData, setConcertData] = useState(null);
  const [filteredResellers, setFilteredResellers] = useState(resellers);

  useEffect(() => {
    fetchConcertData();
  }, []);

  // Fetch separate concert data
  const fetchConcertData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/organizer/${userId}`
      );

      setAllEvents(sortByTime(filterByTime(response.data)));
    } catch (error) {
      console.error("Error fetching entrance checker:", error);
    }
  };

  const handleSelectChange = async (e) => {
    const selectedOption = e.target.value;
    setEvent(selectedOption);

    // Extracting the data-id from the selected option
    const dataId =
      e.target.options[e.target.selectedIndex].getAttribute("data-id");

    // Fetching concert data using the extracted dataId
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${dataId}`
      );
      setConcertData(response.data[0]);
    } catch (error) {
      console.error("Error fetching concert data:", error);
    }
  };

  // Search resellers
  function searchData(e) {
    const searchValue = e.target.value.toLowerCase();
    setFilteredResellers(
      resellers.filter(
        (reseller) =>
          reseller.full_name.toLowerCase().includes(searchValue) ||
          reseller.email.toLowerCase().includes(searchValue)
      )
    );
  }

  return (
    <div className="add-reseller-event">
      <div className="choose-concert">
        <h6>Dodjeljivanje preprodavača</h6>
        <GetAllEvents
          allEvents={allEvents}
          event={event}
          handleSelectChange={handleSelectChange}
        />
      </div>
      <EventDetails concertData={concertData} displayTicketGen={false} />
      <div className="add-reseller-event-bottom">
        <div className="bottom-part">
          {concertData ? (
            <>
              <ProfileTopPart
                fetchData={(e) => {
                  searchData(e);
                }}
                hasSearch={true}
                content="Lista preprodavača"
                searchContent="Pretražite"
              />
              {filteredResellers &&
                filteredResellers.map((e, i) => {
                  return (
                    <AddResellerCard
                      setConcertData={setConcertData}
                      freeSaleData={concertData.tickets.free_sale}
                      concertId={concertData._id}
                      userData={e}
                      key={i}
                    />
                  );
                })}
            </>
          ) : (
            ""
          )}
        </div>
        <ConcertComponent concertData={concertData} />
      </div>
    </div>
  );
};
