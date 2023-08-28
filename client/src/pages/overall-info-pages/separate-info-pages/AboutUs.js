import React from 'react';
import { PageRow } from '../info-pages-parts/PageRow';

export const AboutUs = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Opće informacije"
        content={`Event.ba je kompanija koja vam na najbrži i najsigurniji način pruža mogućnost kupovine ulaznica za sve vrste događaja. Prisutna na tržištu od 2005. godine, naša kompanija je do sada prodala više desetina miliona ulaznica putem interneta i mreže prodajnih mesta, što nas pozicionira kao vodeću kompaniju za prodaju ulaznica u Srbiji.

        Svake godine unapređujemo svoj sistem poslovanja prateći najsavremenije svetske trendove u ticketingu, usmjereni da vama osiguramo što lakši i brži pristup omiljenim događajima.
        
        Ideja koja nas je vodila jeste da organizatorima i korisnicima naših usluga na jednom mjestu pružimo kvalitetnu suvremenu podršku i da uspješno odgovorimo najzahtjevnijim svjetskim događajima i manifestacijama. Osnovu naše ponude u ovom trenutku čini mreža s više od 200 prodajnih mjesta diljem Srbije, online prodaja putem tri portala: ulaznice.ba, nasceni.ba i enterbelgrade.ba, call centar, B2B i B2C korisnička podrška, različite vrste kontrola pristupa s mobilnim uređajima i obradom podataka u stvarnom vremenu, aplikacije za izvještavanje i analizu podataka u različitim formatima, kao i razvijeni online i offline kanali promocije i marketinga.
        
        `}
      />
      <PageRow
        heading="Naš sustav"
        content={`U našem sustavu je u svakom trenutku aktualno više stotina domaćih i inozemnih događaja, koji se distribuiraju kroz pomenute kanale. Partnersku podršku pružamo glazbenim festivalima, kazalištima, koncertima, sportskim događajima svjetskog značaja, live entertainment događajima i mnogim drugim manifestacijama za koje se vrši prodaja ulaznica/karata/vaučera. Na taj način, Event.ba kao distributer ulaznica za mnoge manifestacije, postao je nezaobilazan partner za sve velike događaje i manifestacije u Srbiji i inozemstvu. Neki od njih su: Volleyball World League 2008, UEFA Futsal Euro 2016, Euroleague Final Four 2018, World Athletics Indoor Championships 2022, Beyoncé, Jennifer Lopez, Sade, Bryan Adams, Shakira, Placido Domingo, Il Divo, Phill Collins, Disney on Ice i mnogi drugi različiti svjetski spektakli.

Kompanija Event.ba se trudi da vam pomogne da do svojih događaja dođete na najlakši i najjednostavniji način te da budete prvi koji će osigurati ulaznice za omiljeni glazbeni, sportski, kulturni ili neki drugi događaj. Brzo i lako dođite do informacija te budite prvi koji će osigurati najbolja mjesta za najbolje uživanje.`}
      />
    </div>
  );
};
