import React from 'react';
import { PageRow } from '../info-pages-parts/PageRow';

export const NewsLetter = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Event.ba"
        content={`Test
      `}
      />
    </div>
  );
};
