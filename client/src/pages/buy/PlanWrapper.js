import React from "react";
import Plan from "../../assets/event_ground_plans/concert_ground_plan.png";
import FreeSeat from "../../assets/ikonice/free_seat.svg";
import ReservedSeat from "../../assets/ikonice/reserverd_seat.svg";
import { Seat } from "./Seat";

export const PlanWrapper = ({ ticketID: ticketID }) => {
  return (
    <div className="plan-wrapper">
      <Seat
        seatAvailability={FreeSeat}
        free={true}
        seatId="seat1"
        seattype="vip"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={FreeSeat}
        free={true}
        seatId="seat2"
        seattype="normal"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={FreeSeat}
        free={true}
        seatId="seat3"
        seattype="normal"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={FreeSeat}
        free={true}
        seatId="seat4"
        seattype="normal"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={FreeSeat}
        free={true}
        seatId="seat5"
        seattype="normal"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={ReservedSeat}
        free={false}
        seatId="seat6"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={ReservedSeat}
        free={false}
        seatId="seat7"
        seattype="vip"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={ReservedSeat}
        free={false}
        seatId="seat8"
        seattype="vip"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={ReservedSeat}
        free={false}
        seatId="seat9"
        seattype="normal"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={ReservedSeat}
        free={false}
        seatId="seat10"
        seattype="normal"
        ticketID={ticketID}
      />
      <Seat
        seatAvailability={ReservedSeat}
        free={false}
        seatId="seat11"
        seattype="normal"
        ticketID={ticketID}
      />
      <img
        className="event-plan"
        src={Plan}
        alt="Event plan"
        seattype="normal"
      />
    </div>
  );
};
