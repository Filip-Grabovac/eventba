import React, { useEffect, useState } from "react";
import { PageRow } from "../info-pages-parts/PageRow";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";

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
        console.error("An error occurred:", error);
      }
    }

    fetchSubscriptionStatus();
  }, [userId]);

  if (!userData) return;

  // Switch subscription
  async function handleSubscription() {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/helper/newsletter/${userId}`,
        { userEmail: userData.email }
      );

      setUserData(response.data.user);
      toast.success(response.data.message, toastSetup("top-right", 3000));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    userData && (
      <div className="info-page">
        <h4>{heading}</h4>
        <PageRow
          heading="Newsletter"
          content={` 
        Prijavom na naš newsletter, stvaramo priliku da budete u toku s
        najnovijim događanjima na Event.ba! Pratite najnovije informacije o
        kulturnim, sportskim i zabavnim manifestacijama koje se odvijaju u vašem
        gradu. Posebno ističemo da se opcija za odjavu uvijek dostupna, tako da
        je u svakom trenutku možete iskoristiti po vlastitoj želji.
        <br />
        Želimo naglasiti i da vaši osobni podaci ostaju sigurni kod nas i neće
        biti dijeljeni s trećim stranama.
         <br />
         Slijedite Event.ba i budite prvi koji
        će saznati o najnovijim događajima, bez obzira jeste li spremni za
        sudjelovanje u akciji ili tražite trenutke opuštanja
      
      `}
          newsletterFunction={handleSubscription}
          btnContent={
            userData.newsletter ? "Poništi pretplatu" : "Pretplati se"
          }
        />
      </div>
    )
  );
};
