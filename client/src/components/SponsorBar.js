import React, { cloneElement } from "react";

import centralna from "../assets/logos/centralna.png";
import event from "../assets/logos/eventba.png";

export const SponsorBar = () => {
  const logosSlideElement = (
    <div className="logos-slide">
      <img src={centralna} alt="" />
      <img src={event} alt="" />
      <img src={centralna} alt="" />
      <img src={event} alt="" />
      <img src={centralna} alt="" />
      <img src={event} alt="" />
      <img src={centralna} alt="" />
      <img src={event} alt="" />
    </div>
  );

  const clonedLogosSlideElement = React.cloneElement(logosSlideElement);

  return (
    <div>
      <div className="logos">
        {logosSlideElement}
        {clonedLogosSlideElement}
        {clonedLogosSlideElement}
      </div>
    </div>
  );
};
