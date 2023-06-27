import React, { useState } from "react";
import Plan from "../../assets/event_ground_plans/concert_ground_plan.png";
import FreeSeat from "../../assets/ikonice/free_seat.svg";
import ReservedSeat from "../../assets/ikonice/reserverd_seat.svg";
import { Seat } from "./Seat";

export const PlanWrapper = ({ ticketID }) => {
  const [activeSeat, setActiveSeat] = useState(null);

  const handleSeatClick = (seatId) => {
    setActiveSeat(seatId);
  };

  const seats = [
    { seatId: "seat1", seattype: "vip", available: true },
    { seatId: "seat2", seattype: "normal", available: true },
    { seatId: "seat3", seattype: "normal", available: true },
    { seatId: "seat4", seattype: "normal", available: true },
    { seatId: "seat5", seattype: "normal", available: true },
    { seatId: "seat6", seattype: "normal", available: false },
    { seatId: "seat7", seattype: "vip", available: false },
    { seatId: "seat8", seattype: "vip", available: false },
    { seatId: "seat9", seattype: "normal", available: false },
    { seatId: "seat10", seattype: "normal", available: false },
    { seatId: "seat11", seattype: "normal", available: false },
  ];

  return (
    <div className="plan-wrapper">
      {seats.map((seat) => (
        <Seat
          key={seat.seatId}
          seatAvailability={seat.available ? FreeSeat : ReservedSeat}
          className={seat.seatId}
          free={seat.available}
          seatId={seat.seatId}
          seattype={seat.seattype}
          ticketID={ticketID}
          active={activeSeat === seat.seatId}
          activeSeat={activeSeat}
          setActiveSeat={setActiveSeat}
        />
      ))}
      <img
        className="event-plan"
        src={Plan}
        alt="Event plan"
        seattype="normal"
      />
    </div>
  );
};
