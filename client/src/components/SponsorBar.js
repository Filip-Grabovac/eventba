import React, { cloneElement } from 'react';

import m3 from '../assets/logos/3m.svg';
import barstool from '../assets/logos/barstool-store.svg';
import budweiser from '../assets/logos/budweiser.svg';
import buzzfeed from '../assets/logos/buzzfeed.svg';
import forbes from '../assets/logos/forbes.svg';
import macys from '../assets/logos/macys.svg';
import menshealth from '../assets/logos/menshealth.svg';
import mrbeast from '../assets/logos/mrbeast.svg';

export const SponsorBar = () => {
  const logosSlideElement = (
    <div className="logos-slide">
      <img src={m3} />
      <img src={barstool} />
      <img src={budweiser} />
      <img src={buzzfeed} />
      <img src={forbes} />
      <img src={macys} />
      <img src={menshealth} />
      <img src={mrbeast} />
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
