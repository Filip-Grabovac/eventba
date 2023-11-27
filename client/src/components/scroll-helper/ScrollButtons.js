import React from "react";
import arrow from "../../assets/ikonice/arrow_icon.svg";
import scroll from "../../assets/ikonice/scroll.png";

const ScrollButtons = () => {
  const handleScrollUp = () => {
    window.scrollBy(0, -150);
  };

  const handleScrollDown = () => {
    window.scrollBy(0, 150);
  };

  return (
    <div className="scroll-btn-container">
      <img
        onClick={handleScrollUp}
        style={{ rotate: "180deg" }}
        src={arrow}
        alt="arrow"
      />
      <br />
      <img src={scroll} alt="scroll" style={{ cursor: "default" }} />
      <br />
      <img onClick={handleScrollDown} src={arrow} alt="arrow" />
    </div>
  );
};

export default ScrollButtons;
