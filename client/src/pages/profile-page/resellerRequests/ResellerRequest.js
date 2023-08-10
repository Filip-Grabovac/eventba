import React, { useState } from 'react';
import { ProfileTopPart } from '../userManager/ProfileTopPart';
import { ResellerRequestsCard } from './ResellerRequestsCard';

export const ResellerRequest = ({ resellersRequests }) => {
  const [requestsData, setRequestsData] = useState(resellersRequests.resellers);

  return (
    <div>
      <ProfileTopPart
        hasSearch={false}
        content="Lista preprodavača"
        searchContent="Email/Korisnicko ime"
        isFullLength={true}
      />

      <div className="reseller-requests-wrapper">
        {requestsData && requestsData[0] !== undefined ? (
          requestsData.map((e, i) => {
            return (
              <ResellerRequestsCard
                setRequestsData={setRequestsData}
                requestsData={requestsData}
                key={i}
                data={e}
                i={i}
              />
            );
          })
        ) : (
          <p className="no-searched-users">Nema zahtjeva</p>
        )}
      </div>
    </div>
  );
};
