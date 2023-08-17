import React from 'react';

export const PageRow = ({ heading, content }) => {
  const paragraphs = content.split('<br />');

  return (
    <div className="page-row">
      <div>
        <h6>{heading}:</h6>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};
