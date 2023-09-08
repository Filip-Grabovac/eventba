import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";

export const PaymentInfo = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Plaćanje kreditnom karticom"
        content={`
        Sva plaćanja će biti izvršena u lokalnoj valuti Bosne i Hercegovine – konvertibilnoj marki (BAM), putem online sustava za plaćanje Monri. Monri je poznat online sustav za plaćanje koji se koristi za obradu sigurnih i pouzdanih transakcija putem interneta. Sustav omogućuje trgovcima da prihvate različite vrste plaćanja, uključujući kreditne i debitne kartice. Monri podržava širok spektar kartica, uključujući popularne internacionalne brandove kao što su Mastercard, Maestro ili Visa, te lokalne kartice specifične za određene regije. Njegova napredna tehnologija enkripcije i sigurnosnih protokola osigurava da se osjetljive informacije o plaćanju štite od neovlaštenog pristupa tijekom online transakcija, pružajući korisnicima i trgovcima pouzdanu i sigurnu platnu platformu.
        <br />
        Radi informativnog prikaza cijena u drugim valutama, koristit će se prosječni tečaj Centralne banke Bosne i Hercegovine. Iznos koji će biti naplaćen putem vaše platne kartice bit će prikazan u vašoj lokalnoj valuti putem konverzije prema tečaju koji koriste organizacije za kartično plaćanje, a koji nama u trenutku transakcije nije poznat. Kao rezultat ove konverzije, moguća je manja razlika u odnosu na originalnu cijenu navedenu na našoj web stranici. Zahvaljujemo na razumijevanju.
        <br />
        U ime kompanije Event.ba, obvezujemo se da ćemo čuvati privatnost svih naših kupaca. Prikupljamo samo nužne osnovne podatke o kupcima/korisnicima i podatke potrebne za poslovanje i informiranje korisnika u skladu s dobrim poslovnim običajima i kako bismo pružili kvalitetnu uslugu. Pružamo kupcima mogućnost izbora, uključujući opciju odluke hoće li biti uključeni na mailing liste koje koristimo za marketinške kampanje. Svi podaci o korisnicima/kupcima strogo se čuvaju i dostupni su samo zaposlenicima kojima su ti podaci nužni za obavljanje posla. Svi zaposlenici u kompaniji Event.ba (i poslovni partneri) odgovorni su za poštivanje načela zaštite privatnosti.
        <br />
        Prilikom unosa podataka o platnoj kartici, povjerljive informacije prenose se putem javne mreže u zaštićenom (kriptiranom) obliku upotrebom SSL protokola i PKI sustava, koristeći trenutačno najmoderniju kriptografsku tehnologiju. Sigurnost podataka prilikom kupovine osigurava procesor platnih kartica, tako da cijeli postupak naplate izvršavate u sigurnom okruženju. Podaci o platnoj kartici nikada nisu dostupni našem sustavu.
    
        <br />
        Monri 
        <br />
        Tajnost Vaših podataka je zaštićena i osigurana korištenjem posljednje verzije TLS enkripcije. Stranice za naplatu
putem interneta osigurane su korištenjem Secure Socket Layer (SSL) protokola sa 128-bitnom enkripcijom
podataka. SSL enkripcija je postupak šifriranja podataka radi sprječavanja neovlaštenog pristupa prilikom
njihovog prijenosa.
Time je omogućen siguran prijenos informacija te onemogućen nedozvoljen pristup podacima prilikom
komunikacije između korisnikovog računala i WebPay servisa, te obratno.
WebPay servis i financijske ustanove razmjenjuju podatke uporabom virtualne privatne mreže (VPN), koja je
zaštićena od neautoriziranog pristupa.
Monri Payment Gateway je certificiran prema PCI DSS Level 1 sigurnosnom standardu propisanom Visa i
Mastercard pravilima.
Trgovac ne pohranjuje brojeve kreditnih kartica i brojevi nisu dostupni neovlaštenim osobam
<br />
        U slučaju povrata proizvoda i povrata sredstava kupcu koji je prethodno platio putem kreditne kartice, djelomično ili u cijelosti, bez obzira na razlog povrata, kompanija Event.ba je obvezna izvršiti povrat isključivo putem Mastercard, Maestro ili Visa.
 metoda plaćanja. To znači da će banka, na zahtjev prodavatelja, izvršiti povrat sredstava na račun korisnika kartice.
        <br />
        U cilju zaštite obje strane, kompanija Event.ba, u određenim okolnostima (ako se transakcija pri provjeri pokaže sumnjivom), može kontaktirati kupca za dodatne podatke - skeniranu kreditnu karticu (vidljive zadnje četiri znamenke). Ako ne prihvaćate navedene uvjete poslovanja, možete zatražiti povrat sredstava ili se odlučiti za izravnu kupnju ulaznica na nekom od naših prodajnih mjesta.`}
      />
    </div>
  );
};
