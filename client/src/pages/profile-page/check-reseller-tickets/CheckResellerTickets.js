import React, { useEffect, useState } from "react";
import { CheckTicketsCard } from "./CheckTicketsCard";
import axios from "axios";

export const CheckResellerTickets = ({ resellerInfo, reseller_id }) => {
  const [sellingData, setSellingData] = useState({});

  useEffect(() => {
    fetchResellerData();
  }, []);
  const fetchResellerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/concerts/resellers/${reseller_id}`,
        resellerInfo.concerts
      );
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <div>
      <CheckTicketsCard />
      <CheckTicketsCard />
    </div>
  );
};
