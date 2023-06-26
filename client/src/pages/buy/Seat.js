import React from "react";
import VipIcon from "../../assets/ikonice/vip_icon.svg";

export const Seat = (props) => {
  return (
    <div id={props.seatId} className="seat-wrapper">
      <div>
        {props.seattype === "vip" ? (
          <img className="vip-icon" src={VipIcon}></img>
        ) : (
          ""
        )}
        <img src={props.seatAvailability} alt="Seat" />
      </div>
    </div>
  );
};
