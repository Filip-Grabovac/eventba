import React, { useState } from "react";
import VipIcon from "../../assets/ikonice/vip_icon.svg";
import { useDispatch } from "react-redux";
import { addTicketPrice } from "../../store/ticketSlice";

export const Seat = (props) => {
  const [seatPrice, setSeatPrice] = useState(35);
  const dispatch = useDispatch();
  const ticketID = props.ticketID;

  const handleClick = () => {
    dispatch(addTicketPrice({ seatPrice, ticketID }));
  };

  const disableClick = props.free === false;
  const cursorStyle = disableClick ? { cursor: "not-allowed" } : {};

  return (
    <div
      onClick={disableClick ? null : handleClick}
      id={props.seatId}
      className="seat-wrapper"
      style={cursorStyle}
    >
      <div>
        {props.seattype === "vip" ? (
          <img className="vip-icon" src={VipIcon} alt="VIP Icon" />
        ) : null}
        <img src={props.seatAvailability} alt="Seat" />
      </div>
    </div>
  );
};
