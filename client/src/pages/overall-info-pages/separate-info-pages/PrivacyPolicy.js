import React from 'react';
import { PageRow } from '../info-pages-parts/PageRow';

export const PrivacyPolicy = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Izjava o Zaštiti Podataka za event.ba"
        content={`Ova Izjava o Zaštiti Podataka (u daljnjem tekstu: "Izjava") opisuje kako event.ba prikuplja, koristi i štiti vaše osobne podatke prilikom korištenja naše platforme. Molimo vas da pažljivo pročitate ovu Izjavu kako biste razumjeli naše postupke u vezi s vašim podacima.
        `}
      />
      <PageRow
        heading="Koje podatke prikupljamo"
        content={`Prikupljamo različite vrste osobnih podataka kako bismo vam omogućili pristup našim događajima i uslugama. To uključuje informacije kao što su vaše ime, prezime, adresa, e-mail adresa, telefonski broj te informacije relevantne za odabrane događaje..
        `}
      />
      <PageRow
        heading="Kako koristimo vaše podatke"
        content={`Vaše osobne podatke koristimo kako bismo omogućili pristup događajima za koje ste se registrirali ili za koje ste kupili ulaznice. Također, podaci nam omogućuju da vas obavijestimo o bitnim informacijama vezanim uz te događaje. Ukoliko ste pristali, vaše podatke koristimo i za slanje newslettera s informacijama o budućim događajima.
        `}
      />
      <PageRow
        heading="Otkrivanje trećim stranama"
        content={`Vaši osobni podaci ostaju povjerljivi i nećemo ih dijeliti s trećim stranama osim u određenim okolnostima. Primjerice, možemo dijeliti informacije s organizatorima događaja na koje ste se prijavili radi olakšavanja vaše registracije ili sudjelovanja.
        `}
      />
      <PageRow
        heading="Pohrana podataka"
        content={`Vaši podaci pohranjuju se na siguran način te se obrađuju sukladno važećim zakonima o zaštiti podataka. Čuvamo podatke samo onoliko koliko je potrebno za ostvarivanje svrhe zbog koje su prikupljeni.
        `}
      />
      <PageRow
        heading="Sigurnost podataka"
        content={`Poduzeli smo tehničke i organizacijske mjere kako bismo osigurali sigurnost vaših podataka od gubitka, zloupotrebe ili neovlaštenog pristupa. Naši sustavi redovito se pregledavaju i ažuriraju kako bismo održali visok standard zaštite podataka.
        `}
      />
      <PageRow
        heading="Vaša prava"
        content={`Imate pravo zatražiti pristup osobnim podacima koje čuvamo o vama. Ako podaci nisu točni, imate pravo zatražiti njihovu ispravku. Također, imate pravo zatražiti brisanje vaših podataka kad više nisu potrebni za navedene svrhe, osim ako zakon drugačije ne propisuje..
        `}
      />
      <PageRow
        heading="Newsletteri i komunikacij"
        content={`Ako ste se pretplatili na naš newsletter, šaljemo vam informacije o događajima, ponudama i novostima koje smatramo da vas mogu zanimati. U bilo kojem trenutku možete se odjaviti s newslettera putem poveznice koja se nalazi u svakom e-mailu ili nas kontaktirati radi pomoći.
        `}
      />
      <PageRow
        heading="Promjene Izjave"
        content={`Ova Izjava o Zaštiti Podataka može se povremeno mijenjati kako bismo odgovorili na promjene zakona ili naših usluga. Molimo vas da redovito provjeravate ovu Izjavu radi najnovijih informacija.

        Ova Izjava o Zaštiti Podataka stupa na snagu od datuma objave i važi za sve vaše interakcije s platformom event.ba. Ako imate dodatna pitanja ili nedoumice, slobodno nas kontaktirajte putem navedenih kontaktnih informacija u nastavku.
        `}
      />
    </div>
  );
};
