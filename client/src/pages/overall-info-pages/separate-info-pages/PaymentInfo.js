import React from 'react';
import { PageRow } from '../info-pages-parts/PageRow';

export const PaymentInfo = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Plaćanje kreditnom karticom"
        content={`Sva plaćanja će biti izvršena u lokalnoj valuti Republike Srbije – dinar (RSD). Radi informativnog prikaza cijena u drugim valutama, koristit će se srednji tečaj Narodne Banke Srbije. Iznos koji će biti naplaćen putem vaše platne kartice bit će prikazan u vašoj lokalnoj valuti putem konverzije po tečaju koji koriste kartičarske organizacije, a koji nama u trenutku transakcije nije poznat. Kao rezultat ove konverzije, moguća je manja razlika u odnosu na originalnu cijenu navedenu na našoj web stranici. Zahvaljujemo na razumijevanju.

        U ime kompanije Event.ba, obvezujemo se da ćemo čuvati privatnost svih naših kupaca. Prikupljamo samo nužne osnovne podatke o kupcima/korisnicima i podatke potrebne za poslovanje i informiranje korisnika u skladu s dobrim poslovnim običajima i kako bismo pružili kvalitetnu uslugu. Pružamo kupcima mogućnost izbora, uključujući opciju odluke hoće li biti uključeni na mailing liste koje koristimo za marketinške kampanje. Svi podaci o korisnicima/kupcima strogo se čuvaju i dostupni su samo zaposlenicima kojima su ti podaci nužni za obavljanje posla. Svi zaposlenici u kompaniji Event.ba (i poslovni partneri) odgovorni su za poštivanje načela zaštite privatnosti.
        
        Prilikom unosa podataka o platnoj kartici, povjerljive informacije prenose se putem javne mreže u zaštićenom (kriptiranom) obliku upotrebom SSL protokola i PKI sustava, koristeći trenutačno najmoderniju kriptografsku tehnologiju. Sigurnost podataka prilikom kupovine osigurava procesor platnih kartica, tako da cijeli postupak naplate izvršavate u sigurnom okruženju. Podaci o platnoj kartici nikada nisu dostupni našem sustavu.
        
        U slučaju povrata proizvoda i povrata sredstava kupcu koji je prethodno platio putem kreditne kartice, djelomično ili u cijelosti, bez obzira na razlog povrata, kompanija Event.ba je obvezna izvršiti povrat isključivo putem VISA, EC/MC i Maestro metoda plaćanja. To znači da će banka, na zahtjev prodavatelja, izvršiti povrat sredstava na račun korisnika kartice.
        
        U cilju zaštite obje strane, kompanija Event.ba, u određenim okolnostima (ako se transakcija pri provjeri pokaže sumnjivom), može kontaktirati kupca za dodatne podatke - skeniranu kreditnu karticu (vidljive zadnje četiri znamenke). Ako ne prihvaćate navedene uvjete poslovanja, možete zatražiti povrat sredstava ili se odlučiti za izravnu kupnju ulaznica na nekom od naših prodajnih mjesta.
        `}
      />
      <PageRow
        heading="Pravne osobe - plaćanje temeljem predračuna"
        content={`Za naručivanje i plaćanje ulaznica putem predračuna za pravne osobe, potrebno je poslati sljedeće podatke na e-mail adresu callcenter@event.ba: naziv tvrtke, adresu, OIB i e-mail adresu na koju naša služba treba poslati predračun. Također je potrebno naglasiti za koji događaj se naručuju ulaznice, količinu ulaznica te cjenovnu kategoriju ulaznica za koje je potreban predračun.
        `}
      />
    </div>
  );
};
