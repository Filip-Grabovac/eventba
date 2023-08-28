import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const NewsLetter = ({ profileData }) => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    setUserData(profileData);
  }, []);

  if (!userData) return;

  async function newsletterFunction() {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/helper/newsletter/${userData._id}`,
        { userEmail: userData.email }
      );

      setUserData(response.data.user);
      toast.success(response.data.message, toastSetup('top-right', 3000));
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  return (
    <div className="newsletter-profile-container">
      <h6>Newsletter</h6>
      <p>
        Prijavom na newsletter, korisnik prihvata da od strane Ticket Vision-a
        na email dobija Novosti vezane za događaje koji su u sistemu prodaje.
        Korisnik u svakom trenutku može samostalno da se odjavi sa mailing liste
        - link za odjavu se nalazi u mailu koji se šalje prilikom prijave. Vaši
        lični podaci su zaštićeni te neće biti dati na uvid trećim licima.
      </p>
      <a
        onClick={() => {
          newsletterFunction();
        }}
        className="newsletter-application"
        href="#"
      >
        {userData.newsletter ? 'Poništi pretplatu' : 'Pretplati se'}
      </a>
    </div>
  );
};
