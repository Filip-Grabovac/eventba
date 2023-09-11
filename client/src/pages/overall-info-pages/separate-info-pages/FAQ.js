import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";

export const FAQ = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Kupio sam ulaznice za događaj koji je otkazan / odložen ili premešten. Šta treba da radim?"
        content={`Event.ba nije organizator događaja i stoga ne snosi odgovornost za povraćaj novca od ulaznice. Međutim, mi činimo sve da se obezbedi sigurnost novca od ulaznice i samim tim normalno da koristimo sledeće procedure:

        U slučaju otkazivanja/odlaganja ili premeštanja događaja, molimo Vas da nas kontaktirate na mail info@event.ba.
        `}
      />
      <PageRow
        heading="Događaj je otkazan / odgođen / premješten, a nisam obaviješten. Zašto?"
        content={`Event.ba nije obvezan obavijestiti vlasnike ulaznica o mogućem otkazivanju/odgađanju/premještanju, međutim, trudimo se obavijestiti sve kupce što je češće moguće.

    Mogući razlozi zašto niste obaviješteni o otkazivanju/odgađanju/premještanju mogu biti:

    Nemamo vaše kontakt informacije, ili imamo netočne, nevažeće kontakt informacije.
    Organizator nas nije pravodobno obavijestio.
    Kao mjera opreza, molimo provjerite web stranicu (www.event.ba) prije nego prisustvujete događaju radi eventualnih promjena. U svakom slučaju, ne prihvaćamo odgovornost za prijevoz, hotel ili slične troškove vezane uz otkazani/odgođeni/premješteni događaj.
    `}
      />
      <PageRow
        heading="Izgubio/la sam ulaznice ili su ukradene. Možete li mi pomoći?"
        content={`Ulaznica je fizički dokument - za koji ne može biti izdana zamjena u slučaju gubitka ili krađe. Ako imate dodatnih pitanja, slobodno nas kontaktirajte putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Tijekom online kupovine rezervirao/la sam krivi događaj / krivi broj karata / krivu kategoriju..."
        content={`Odmah nakon završetka postupka kupovine, sustav automatski evidentira ulaznice kao prodane i nikakve promjene nisu moguće. Molimo vas da nas kontaktirate putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Mogu li nakon kupovine promijeniti ili otkazati svoju rezervaciju?"
        content={`Odmah nakon završetka postupka kupovine, sustav automatski evidentira ulaznice kao prodane i nikakve promjene nisu moguće. Nažalost, nismo u mogućnosti otkazati/promijeniti narudžbu nakon što ste već kupili ulaznice. Zamjena, poništenje ili otkazivanje ulaznica nije dopušteno od strane organizatora s kojima surađujemo. Ako imate dodatnih pitanja, slobodno nas kontaktirajte putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Naplaćen je pogrešan iznos s računa moje kreditne kartice."
        content={`U tom slučaju, kontaktirajte nas putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Moja kupovina nije uspjela / došlo je do pogreške."
        content={`Molimo vas da nas kontaktirate putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Cijena na ulaznici je niža od cijene koju sam platio/la za ulaznicu."
        content={`Event.ba je odgovoran za rezervacije, bukiranje i dostavu ulaznica, te pružanje ulaznica dostupnih u pretprodaji. Stoga se unaprijed naplaćuje prodaja, kao i određene pristojbe. Na web stranici događaja, kao i na samoj ulaznici, prikazana je cijena same ulaznice, bez troškova dodatnih usluga.
    `}
      />

      <PageRow
        heading="Kako su stvoreni dodatni troškovi na mom računu?"
        content={`Konačni iznos koji morate platiti za ulaznice sastoji se od cijene ulaznica, dodatnih troškova usluge po narudžbi (uključujući sve druge pristojbe vezane uz rezervaciju i bukiranje ulaznica).
    `}
      />

      <PageRow
        heading="Nakon otkazivanja događaja, vraćeni iznos je manji od ukupnog iznosa koji sam platio/la."
        content={`Event.ba je odgovoran za prodaju ulaznica i ne jamči povrat iznosa koji je plaćen u slučaju otkazivanja događaja. Međutim, nastojimo stupiti u kontakt s organizatorom događaja kako bi se regulirao povrat novca. U slučaju povrata, primit ćete cijeli iznos naveden na ulaznici. Dodatne naknade koje su naplaćene (promjene cijena, dodatni troškovi, troškovi dostave itd.) neće biti vraćene od strane Event.ba.
    `}
      />

      <PageRow
        heading="Vrijednost ulaznica nije vraćena nakon otkazivanja događaja."
        content={`U tom slučaju, molimo vas da nas kontaktirate putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Kupio/la sam ulaznice na internetu, ali još nisam dobio/la potvrdu."
        content={`Molimo vas da provjerite je li naša e-pošta s potvrdom možda završila u vašem neželjenom poštanskom sandučiću (spam, junk, important...). Također, moguće je da niste primili potvrdu zbog krivo unesene e-adrese ili iz drugih razloga.
<br />
    U tom slučaju, molimo vas da nas kontaktirate putem e-pošte na info@event.ba. Navedite svoje puno ime, datum vaše narudžbe i koji je događaj u pitanju. Obavijestit ćemo vas je li vaša narudžba uspješna ili neuspješna.
    <br />
    Ako imate dodatnih pitanja, slobodno nas kontaktirajte putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Želim ostaviti komentar / pritužbu o događaju kojem sam prisustvovao/la"
        content={`Event.ba osigurava ulaznice i nije odgovoran za kvalitetu događaja. Potpuna organizacija događaja, lokacija i utvrđivanje cijena je odgovornost organizatora događaja i nema veze s našim radom.

    Ako vaša narudžba/ulaznica nije valjana, molimo vas da nas obavijestite putem e-pošte na info@event.ba.
    `}
      />
      <PageRow
        heading="Kako mogu provjeriti svoj korisnički račun?"
        content={`Možete se prijaviti kako biste provjerili svoje narudžbe.

    Molimo vas da koristite polje "Prijava" koje se nalazi na vrhu web stranice kako biste unijeli svoju e-adresu i lozinku koju ste odabrali. Nakon uspješne prijave, samo kliknite na dio računa koji želite provjeriti (moj profil, moje ulaznice, newsletter...).
    
    Ako imate dodatnih pitanja, slobodno nas kontaktirajte putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Zaboravio/la sam svoju lozinku. Šta mogu učiniti?"
        content={`Ako ste zaboravili svoju lozinku, jednostavno kliknite na dugme "Prijavi se" na našoj početnoj stranici i ispod obrasca za prijavu će se pojaviti opcija "Zaboravljena lozinka?" Tada ćete primiti e-poruku na unesenu e-adresu s uputama o tome što trebate poduzeti.

    Ako imate dodatnih pitanja, slobodno nas kontaktirajte putem e-pošte nainfo@event.ba.
    `}
      />
      <PageRow
        heading="Kako mogu promijeniti svoje podatke?"
        content={`Da biste promijenili svoje podatke, prijavite se na našoj web stranici ili, ako već jeste prijavljeni, kliknite na "Profil/Ažuriraj podatke". Ovdje možete promijeniti svoje informacije.

    Ako imate dodatnih pitanja, slobodno nas kontaktirajte putem e-pošte na info@event.ba.
    `}
      />

      <PageRow
        heading="Kada i gdje se određeni događaj odvija?"
        content={`Sve informacije o vremenu, cijenama i lokaciji događaja možete pronaći na našoj web stranici: www.event.ba

    Ako niste uspjeli pronaći određeni događaj, molimo vas da redovno provjeravate našu web stranicu. Zbog neprestanog širenja naše ponude, određeni događaji se mogu uskoro pojaviti u prodaji.
    
    Ne dopustite da propustite svoj omiljeni događaj ponovno! S Event.ba ćete redovno biti obavješteni o novim informacijama o vašim omiljenim izvođačima i događajima. Registrirajte se za naš newsletter kako biste dobivali važne informacije i najave događaja.
    
    Ako već posjedujete određenu ulaznicu, sve važne informacije o datumu događaja i lokaciji možete pronaći na samoj ulaznici.
    
    U slučaju promjena datuma ili lokacije događaja, pronaći ćete sve potrebne informacije na našoj web stranici. Pokušat ćemo vas obavijestiti o promjenama putem e-pošte. Molimo vas da provjerite i druge izvore na internetu putem tražilice ili saznate o mogućim promjenama na web stranici događaja.
    `}
      />
      <PageRow
        heading="Povratne informacije - Što želite da nam kažete..."
        content={`Imate li prijedloge, pritužbe, komentare...? Što možemo učiniti bolje? Želimo čuti povratne informacije od svakog kupca kako bismo postavili i poboljšali visoku kvalitetu besprijekornog procesa rezervacije. Očekujemo vaše poruke i komentare!

    Vaše sugestije i pritužbe ozbiljno shvaćamo i jamčimo da ćemo ih uzeti u obzir jer nam je vaše mišljenje izuzetno važno.
    
    Ako želite da nas kontaktirate, slobodno nas možete dohvatiti putem e-pošte na adresu info@event.ba.
    `}
      />
    </div>
  );
};
