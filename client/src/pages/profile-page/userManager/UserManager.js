import React, { useState } from 'react';
import SearchIcon from '../../../assets/ikonice/search_icon.png';
import { UserManagerCard } from './UserManagerCard';
import axios from 'axios';

export const UserManager = () => {
  const [data, setData] = useState('Pretrazi korisnike');

  const fetchData = async (e) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/api/v1/users/search/${e.target.value}`
      ); // Replace 'https://api.example.com/data' with your API endpoint
      setData(response.data);
    } catch (error) {
      setData('Pretrazi korisnike');
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <div className="user-manager-top">
        <div>
          <p>Lista korisnika</p>
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
      <div className="user-manager-bottom">
        {data && typeof data === 'object' ? (
          data.users.map((e, i) => {
            return e && <UserManagerCard data={e} key={i} />;
          })
        ) : (
          <p className="no-searched-users">{data}</p>
        )}
      </div>
    </div>
  );
};
