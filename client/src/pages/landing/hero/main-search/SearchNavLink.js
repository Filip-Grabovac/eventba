import React from 'react';

export const SearchNavLink = (props) => {
  return (
    <li>
      <a
        className={`${props.isActive} suggested-search-link`}
        onClick={() => props.handleClick(props.category)}
      >
        {props.content}
      </a>
    </li>
  );
};
