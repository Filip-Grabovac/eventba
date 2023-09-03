import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";

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
      toast.success(response.data.message, toastSetup("top-right", 3000));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div className="newsletter-profile-container">
      <h6>Newsletter</h6>
      <p>
        Prijavom na naš newsletter, stvaramo priliku da budete u toku s
        najnovijim događanjima na Event.ba! Pratite najnovije informacije o
        kulturnim, sportskim i zabavnim manifestacijama koje se odvijaju u vašem
        gradu. Posebno ističemo da se opcija za odjavu uvijek dostupna, tako da
        je u svakom trenutku možete iskoristiti po vlastitoj želji.
        <br />
        Želimo naglasiti i da vaši osobni podaci ostaju sigurni kod nas i neće
        biti dijeljeni s trećim stranama. Slijedite Event.ba i budite prvi koji
        će saznati o najnovijim događajima, bez obzira jeste li spremni za
        sudjelovanje u akciji ili tražite trenutke opuštanja
      </p>
      <a
        onClick={() => {
          newsletterFunction();
        }}
        className="newsletter-application"
        href="#"
      >
        {userData.newsletter ? "Poništi pretplatu" : "Pretplati se"}
      </a>
    </div>
  );
};
