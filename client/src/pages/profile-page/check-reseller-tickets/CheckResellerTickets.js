import React, { useEffect, useState } from 'react';
import { CheckTicketsCard } from './CheckTicketsCard';
import axios from 'axios';

export const CheckResellerTickets = ({ resellerInfo, reseller_id }) => {
  const [sellingData, setSellingData] = useState();

  useEffect(() => {
    fetchResellerData();
  }, []);

  const fetchResellerData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/resellers/${reseller_id}`,
        { concertIds: resellerInfo.concerts }
      );
      setSellingData(response.data);
    } catch (error) {}
  };

  return (
    <div>
      {sellingData &&
        sellingData.resellersConcerts.map((e, i) => {
          return <CheckTicketsCard key={i} data={e} />;
        })}
    </div>
  );
};
