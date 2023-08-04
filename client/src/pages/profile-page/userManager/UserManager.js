import React, { useEffect, useState } from 'react';
import { UserManagerCard } from './UserManagerCard';
import axios from 'axios';
import { ProfileTopPart } from './ProfileTopPart';

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

  // Update UI
  async function removeUserFromUI(id) {
    setData((prevData) => ({
      ...prevData,
      users: prevData.users.filter((user) => user._id !== id),
    }));
  }

  // If last user is deleted
  useEffect(() => {
    if (typeof data === 'object' && data.users[0] === undefined) {
      setData('Pretrazi korisnike');
    }
  }, [data]);

  return (
    <div>
      <ProfileTopPart
        fetchData={fetchData}
        content="Lista korisnika"
        hasSearch={true}
        searchContent="Email/Korisnicko ime"
      />
      <div className="user-manager-bottom">
        {data && typeof data === 'object' ? (
          data.users.map((e, i) => {
            return (
              e && (
                <UserManagerCard
                  data={e}
                  removeUserFromUI={removeUserFromUI}
                  key={i}
                />
              )
            );
          })
        ) : (
          <p className="no-searched-users">{data}</p>
        )}
      </div>
    </div>
  );
};
