import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";
import { NavLink } from "react-router-dom";

export const TermsOfUseOrganizer = () => {
  return (
    <div className="info-page">
      <div className="navbar-terms-of-use">
        <NavLink to={`?page_type=terms_of_use_buyer`}>
          <h4 className="terms-h4"> Uvijeti korištenja za kupca</h4>
        </NavLink>

        <NavLink to="?page_type=terms_of_use_organizer" className="current">
          <h4 className="terms-h4">Uvijeti korištenja za organizatore</h4>
        </NavLink>
      </div>
      <PageRow
        heading="Opći uvjeti poslovanja s Organizatorom"
        content={`Korištenjem event.ba sustava za prodaju ulaznica, prihvaćate i slažete se sa svim pravima, obvezama i odgovornostima navedenim u ovom dokumentu. Ovaj dokument predstavlja i ugovor između Vas kao Organizatora i event.ba.
      `}
      />
      <PageRow
        heading="Uvjeti prodaje i odgovornosti Organizatora"
        content={`Putem event.ba platforme, omogućujemo vam prodaju ulaznica za vaše događaje. Međutim, važno je napomenuti da morate biti pravno valjana osoba (tvrtka, obrt, udruga i slično) kako biste koristili naše usluge. Slažete se da ćete osigurati ispravne i točne informacije o vašem događaju. U slučaju netočnih podataka ili lažnog predstavljanja, zadržavamo pravo poništenja prodanih ulaznica i povrata novca kupcima.
    <br />
        Svojim unosom u event.ba sustav postajete vlasnik i izdavač ulaznica za svoj događaj. To znači da ste odgovorni za sve informacije i uvjete vezane uz događaj. Također, obvezujete se isporučiti proizvode ili usluge na najkvalitetniji mogući način, poštujući standarde kvalitete. Sve obaveze, troškove i potraživanja Kupaca snosite sami, kao i eventualne naknade zbog neiskorištenih ulaznica.
      `}
      />
      <PageRow
        heading="Otkazivanje i promjene"
        content={`Razumijemo da se ponekad događaji mogu promijeniti ili otkazati. Ako se to dogodi, kao Organizator, obvezujete se odmah obavijestiti event.ba o svakoj bitnoj promjeni, otkazivanju ili drugim situacijama koje bi mogle zahtijevati povrat novca kupcima. U slučaju otkazivanja događaja ili bitnih promjena, vi kao Organizator preuzimate odgovornost za povrat novca kupcima.
      `}
      />
      <PageRow
        heading="Poništavanje transakcije od strane banke"
        content={`Iako težimo glatkom procesu plaćanja, razumijemo da ponekad transakcije mogu biti poništene od strane banke, posebno u slučaju žalbi kupaca. U takvim situacijama, rizik od otkazivanja plaćanja snosi Organizator. U slučaju poništenih uplata, Organizator će biti naplaćen za poništene iznose, uključujući troškove povezane s povratom sredstava.
      `}
      />
      <PageRow
        heading="Europska Opća uredba o zaštiti podataka (GDPR)"
        content={`Kao Organizator, razumijemo važnost zaštite osobnih podataka. Sukladno europskoj Općoj uredbi o zaštiti podataka (GDPR), preuzimate odgovornost za pravilno postupanje s osobnim podacima kupaca koje prikupljate putem event.ba sustava. Važno je osigurati transparentnost i privolu korisnika za prikupljanje i obradu njihovih podataka.
        <br />
        Osobne podatke kupaca obrađujete odgovorno i sukladno GDPR-u.
        Ako prikupljate posebne kategorije podataka, to činite isključivo uz dobrovoljnu privolu korisnika.
        Važno je da ne koristite sustav za prodaju ulaznica osobama mlađim od 16 godina.
        Za marketinške svrhe poput slanja newslettera, prikupljanje e-mail adresa zahtijeva izričitu privolu korisnika.
        Preporučuje se imati vlastitu Izjavu o zaštiti podataka na vašoj web stranici.
      `}
      />
      <PageRow
        heading="Zaštita autorskih prava"
        content={`Sva prava nakladnika i nositelja programa na snimljenom i tiskanom djelu su pridržana. Izdavač i nakladnik je
event.ba. Kupac se obvezuje da neće neovlašteno umnožavati, izvoditi, koristi za radio difuziju te prodavati
proizvode prodavatelja niti bilo koji dio tih proizvoda
        `}
      />
    </div>
  );
};
