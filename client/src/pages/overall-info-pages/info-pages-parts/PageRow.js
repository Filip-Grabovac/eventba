import React from 'react';

export const PageRow = ({
  heading,
  content,
  newsletterFunction,
  btnContent,
}) => {
  const paragraphs = content.split('<br />');
  return (
    <div className="page-row">
      <div>
        <h6>{heading}</h6>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        {heading === 'Newsletter' ? (
          <a
            onClick={() => {
              newsletterFunction();
            }}
            className="newsletter-application"
            href="#"
          >
            {btnContent}
          </a>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
