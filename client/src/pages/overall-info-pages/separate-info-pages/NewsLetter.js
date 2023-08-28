import React, { useEffect, useState } from 'react';
import { PageRow } from '../info-pages-parts/PageRow';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const NewsLetter = ({ heading }) => {
  const [userData, setUserData] = useState();
  const userId = useSelector((state) => state.userState.user);

  // GET subscription
  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/id/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }

    fetchSubscriptionStatus();
  }, [userId]);

  if (!userData) return;

  // Switch subscription
  async function handleSubscription() {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/users/newsletter`,
        userData.email
      );

      toast.success(response.data.message, toastSetup('top-right', 3000));
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Newsletter"
        content={`Prijavom na newsletter, korisnik prihvata da od strane Ticket Vision-a na email dobija Novosti vezane za događaje koji su u sistemu prodaje. Korisnik u svakom trenutku može samostalno da se odjavi sa mailing liste - link za odjavu se nalazi u mailu koji se šalje prilikom prijave. Vaši lični podaci su zaštićeni te neće biti dati na uvid trećim licima.
      `}
        newsletterFunction={handleSubscription}
        btnContent={userData.newsletter ? 'Poništi pretplatu' : 'Pretplati se'}
      />
    </div>
  );
};
