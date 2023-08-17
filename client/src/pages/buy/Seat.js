import React, { useState } from 'react';
import VipIcon from '../../assets/ikonice/vip_icon.svg';
import { useDispatch } from 'react-redux';
import { addTicketPrice } from '../../store/ticketSlice';
import { Tooltip } from 'react-tooltip';

export const Seat = (props) => {
  const [seatPrice, setSeatPrice] = useState(35);
  const dispatch = useDispatch();
  const ticketID = props.ticketID;

  const handleClick = () => {
    dispatch(addTicketPrice({ ticketPrice: seatPrice, ticketID }));
    props.setActiveSeat(props.seatId);
  };

  const disabled = !props.free;
  const cursorStyle = disabled ? { cursor: 'not-allowed' } : {};

  return (
    <div
      onClick={disabled ? null : handleClick}
      id={`${props.seatId}-${ticketID}`}
      className={`${props.active ? 'active' : ''} seat-wrapper ${props.seatId}`}
      style={cursorStyle}
    >
      <div>
        {props.seattype === 'vip' ? (
          <img className="vip-icon" src={VipIcon} alt="VIP Icon" />
        ) : null}
        <img src={props.seatAvailability} alt="Seat" />
      </div>
      <Tooltip
        className="tooltip-seat"
        classNameArrow="seat-arrow"
        style={{ backgroundColor: disabled ? '#323232' : '#455cd9' }}
        anchorId={`${props.seatId}-${ticketID}`}
        place="top"
        variant="info"
        content={props.free ? `Slobodno Cijena: ${seatPrice} BAM` : 'Zauzeto'}
      />
    </div>
  );
};
