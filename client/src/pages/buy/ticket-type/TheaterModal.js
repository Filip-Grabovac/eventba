import React from "react";

export const TheaterModal = ({
  selectedZoneData,
  theaterZones,
  takeSeat,
  activeCardIndex,
}) => {
  return (
    <div className="modal">
      {selectedZoneData[1] && (
        <span className="zone-info">
          Zona: {selectedZoneData[0]} - Cijena: {selectedZoneData[1].price}{" "}
          <small>BAM</small>
        </span>
      )}
      <div className="reverse-flex">
        {theaterZones &&
          selectedZoneData &&
          Object.entries(theaterZones[selectedZoneData[0]].rows).map(
            ([key, value]) => {
              const reservedSeats = value.reserved_seats || {};

              return (
                <div key={key} className="seats-container">
                  <div className="seats-wrapper">
                    <span className="row-info">Red {key} :</span>
                    {Array.from(
                      { length: Number(value.total_seats) },
                      (_, i) => {
                        const seatNumber = i + 1;
                        const isSeatReserved = seatNumber in reservedSeats;
                        const reservedTicketID = isSeatReserved
                          ? reservedSeats[seatNumber].ticketID
                          : null;

                        return (
                          <div
                            key={`${i}-${key}-${seatNumber}`}
                            className={
                              value.seats.includes(i + 1)
                                ? isSeatReserved
                                  ? `reserved`
                                  : `free`
                                : `sold`
                            }
                            onClick={() => {
                              takeSeat(seatNumber, activeCardIndex + 1, key);
                            }}
                          >
                            {reservedTicketID || seatNumber}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
};
