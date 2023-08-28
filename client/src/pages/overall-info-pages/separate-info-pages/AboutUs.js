import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";

export const AboutUs = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Opće informacije"
        content={`Event.ba predstavlja dinamičan projekt koji teži da postane vođeći online portal za prodaju ulaznica, produkciju i promociju događaja u regiji. Naša platforma koristi najsuvremenije web tehnologije kako bi omogućila brz, siguran i jednostavan proces kupovine ulaznica. Kroz inovativne karakteristike, kao što je QR kod verifikacija, osiguravamo autentičnost ulaznica i sprečavamo neovlašten pristup.
        <br />
        Projekat je razvijen s pažljivošću prema detaljima, fokusiran na korisničko iskustvo. Naš tim stručnjaka je posvećen pružanju podrške organizatorima događaja kroz jednostavan postupak postavljanja događaja i integraciju naprednih alata za promociju. Event.ba ne teži samo prodaji ulaznica, već i stvaranju nezaboravnih trenutaka za posjetitelje.
        <br />
        QR kod tehnologija koristi se za brzu i pouzdanu verifikaciju ulaznica na samom događaju, osiguravajući glatku provjeru i sprečavajući zloupotrebu. Naša vizija je postati ne samo platforma, već i partner organizatorima i posjetiteljima, pružajući jedinstvena iskustva koja ostaju urezana u pamćenje.
        <br />
        Kroz inovacije i kreativnost, stvaramo mostove između organizatora i publike, ostavljajući trag na kulturnoj sceni regije.
        `}
      />
    </div>
  );
};
