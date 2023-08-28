import React, { useEffect, useState } from "react";
import { PageRow } from "../info-pages-parts/PageRow";
import axios from "axios";

export const SellingPlaces = ({ heading }) => {
  const [resellers, setResellers] = useState([]);
  useEffect(() => {
    fetchResellers();
  }, []);
  const fetchResellers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/users/reseller`
      );
      setResellers(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <div className="info-page">
      <h4>{heading}</h4>
      {resellers !== [] &&
        resellers.map((reseller, i) => (
          <PageRow
            key={i}
            heading={`${reseller.sellingPlaceName} - ${reseller.sellingPlaceAddress} `}
            content={""}
            data={reseller}
          />
        ))}
    </div>
  );
};
