import React from 'react';
import { ProfileTopPart } from '../userManager/ProfileTopPart';
import { ResellerRequestsCard } from './ResellerRequestsCard';

export const ResellerRequest = () => {
  function fetchData() {}

  return (
    <div>
      <ProfileTopPart fetchData={fetchData} content="Lista preprodavača" />

      <div className="reseller-requests-wrapper">
        <ResellerRequestsCard />
      </div>
    </div>
  );
};
