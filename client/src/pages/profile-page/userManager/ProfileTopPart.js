import React from 'react';
import SearchIcon from '../../../assets/ikonice/search_icon.png';

export const ProfileTopPart = ({ fetchData, content }) => {
  return (
    <div className="user-manager-top">
      <div>
        <p>{content}</p>
      </div>
      <div>
        <div className="search-input-wrapper">
          <input
            onInput={(e) => {
              fetchData(e);
            }}
            type="text"
            placeholder="Email/Korisnicko ime"
          />
          <img src={SearchIcon} alt="Search" />
        </div>
      </div>
    </div>
  );
};
