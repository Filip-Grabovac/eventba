import React from "react";

export const TheaterModal = ({
  selectedZoneData,
  theaterZones,

  takeSeat,
  activeCardIndex,
}) => {
  return (
    <div className="modal">
      {theaterZones &&
        selectedZoneData &&
        Object.entries(theaterZones[selectedZoneData[0]].rows).map(
          ([key, value]) => {
            const reservedSeats = value.reserved_seats || {};

            return (
              <div key={key} className="seats-container">
                <p>Red: {key}</p>
                <div className="seats-wrapper">
                  {Array.from({ length: Number(value.total_seats) }, (_, i) => {
                    const seatNumber = i + 1;
                    const isSeatReserved = seatNumber in reservedSeats;
                    const reservedTicketID = isSeatReserved
                      ? reservedSeats[seatNumber].ticketID
                      : null;

                    return (
                      <div
                        className={
                          value.seats.includes(i + 1)
                            ? isSeatReserved
                              ? `reserved`
                              : `free`
                            : `sold`
                        }
                        key={i}
                        onClick={() => {
                          takeSeat(seatNumber, activeCardIndex + 1, key);
                        }}
                      >
                        {reservedTicketID || seatNumber}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
    </div>
  );
};
