import React, { useEffect, useState } from "react";
import { hrTimeFormat } from "../../../components/helper/timeFormat";
import { TicketGen } from "./TicketGen";
import OnlineTicketManager from "./OnlineTicketManager";
import { OnlineTheaterManager } from "./OnlineTheaterManager";
import axios from "axios";

export const EventDetailsTicket = ({
  concertData,
  setConcertData,
  adminEmail,
  adminName,
  displayTicketGen = false,
}) => {
  const [showPrint, setShowPrint] = useState(true);
  const [rows, setRows] = useState(concertData?.tickets.online_sale.zones);
  const [placeData, setPlaceData] = useState({});
  let selectedHall = concertData?.place.place;

  useEffect(() => {
    if (concertData?.place.type === "theater") {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/concerts/id/${concertData._id}`
          );
          setConcertData(response.data[0]);
          setRows(response.data[0].tickets.online_sale.zones);
        } catch (error) {
          console.error("Error fetching concert data:", error);
        }
      };

      fetchData(); // Call the async function immediately
    }
  }, [showPrint, concertData._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        selectedHall = concertData.place.place;
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/places/zones`,
          {
            params: { selectedHall },
          }
        );
        setPlaceData(response.data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function immediately
  }, [concertData]);

  return (
    <div className="concert-container">
      {concertData && (
        <>
          <div className="top-part">
            <div className="info">
              <h4>{concertData.performer_name}</h4>
              <p style={{ textTransform: "capitalize" }}>
                {new Date(concertData.time_of_event).toLocaleDateString(
                  "hr-HR",
                  hrTimeFormat
                )}{" "}
                - {concertData.place.place}, {concertData.place.city},{" "}
                {concertData.place.country}
              </p>
            </div>
            <img
              className="info-buy-page-image"
              src={
                concertData?.poster?.landscape
                  ? `${process.env.REACT_APP_API_URL}/static/event-images/${concertData.poster.landscape}`
                  : ""
              }
              alt="concertData.poster.landscape"
            />
          </div>

          {displayTicketGen ? (
            <>
              <div
                className="btn-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <button
                  style={
                    showPrint
                      ? { scale: "1.15", translate: "16vw" }
                      : { backgroundColor: "#E6B36E", scale: "0.85" }
                  }
                  onClick={() => setShowPrint(true)}
                >
                  {"Print ulaznice"}
                </button>
                <button
                  style={
                    !showPrint
                      ? { scale: "1.15", translate: "-16vw" }
                      : { backgroundColor: "#E6B36E", scale: "0.85" }
                  }
                  onClick={() => setShowPrint(false)}
                >
                  {"Online ulaznice"}
                </button>
              </div>
              {showPrint ? (
                <>
                  <h6>Izradi print ulaznice</h6>
                  <TicketGen
                    setConcertData={setConcertData}
                    concertData={concertData}
                    adminEmail={adminEmail}
                    adminName={adminName}
                  />
                </>
              ) : (
                <>
                  <h6>Upravljaj online ulaznicama</h6>
                  {concertData.place.type === "hall" ? (
                    <OnlineTicketManager
                      onlineSale={concertData.tickets.online_sale}
                      id={concertData._id}
                    />
                  ) : (
                    placeData.ground_plan && (
                      <OnlineTheaterManager
                        id={concertData._id}
                        onlineSale={concertData.tickets.online_sale}
                        placeData={placeData}
                        setRows={setRows}
                        rows={rows}
                      />
                    )
                  )}
                </>
              )}
            </>
          ) : null}
        </>
      )}
    </div>
  );
};
