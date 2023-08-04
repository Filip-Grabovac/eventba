import React from 'react';
import SearchIcon from '../../../assets/ikonice/search_icon.png';

export const ProfileTopPart = ({
  fetchData,
  content,
  hasSearch,
  searchContent,
}) => {
  return (
    <div className="user-manager-top">
      <div>
        <p>{content}</p>
      </div>
      {hasSearch ? (
        <div>
          <div className="search-input-wrapper">
            <input
              onInput={(e) => {
                fetchData(e);
              }}
              type="text"
              placeholder={searchContent}
            />
            <img src={SearchIcon} alt="Search" />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
