import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";
import { Link } from "react-router-dom";

export const TermsOfUseBuyer = () => {
  return (
    <div className="info-page">
      <div className="navbar-terms-of-use">
        <Link to="?page_type=terms_of_use_buyer" className="current">
          <h4 className="terms-h4"> Uvijeti korištenja za kupca</h4>
        </Link>

        <Link to="?page_type=terms_of_use_organizer">
          <h4 className="terms-h4">Uvijeti korištenja za organizatore </h4>
        </Link>
      </div>
      <PageRow
        heading="Opis usluge"
        content={`Platforma event.ba pruža korisnicima mogućnost kupovine proizvoda i usluga putem svoje internetske stranice. Kao posrednik, event.ba omogućava organizatorima događaja da promoviraju i prodaju svoje proizvode/usluge te korisnicima pruža priliku da pribave pravo pristupa različitim događanjima. Sustav je osmišljen kako bi olakšao povezivanje organizatora događaja i kupaca, omogućujući im da međusobno ostvare kontakt i sklope poslove.
        `}
      />
      <PageRow
        heading="Registracija korisničkog profila"
        content={`Da bi korisnici mogli koristiti usluge platforme event.ba, potrebno je da se registriraju i otvore korisnički profil. Ovaj korak omogućava korisnicima da imaju jednostavan pristup svojim narudžbama, povijesti kupovina i omiljenim postavkama. Prihvaćanjem ovih uvjeta korištenja, korisnici izražavaju svoju suglasnost s pravima i obvezama navedenim u dokumentu, čime se uspostavlja pravni okvir između korisnika i platforme event.ba.
        `}
      />
      <PageRow
        heading="Promjene uvjeta"
        content={`Platforma event.ba zadržava pravo izmjene uvjeta korištenja u bilo kojem trenutku. Ove promjene mogu biti provedene bez prethodne obavijesti korisnicima. U svrhu informiranja korisnika o eventualnim promjenama, preporučuje se korisnicima da povremeno pregledavaju uvjete korištenja. Nastavak korištenja platforme event.ba nakon izmjena uvjeta podrazumijeva da su korisnici upoznati s novim uvjetima te da ih prihvaćaju u cijelosti.
        `}
      />
      <PageRow
        heading="Kupnja usluge i generiranje ulaznica"
        content={`Platforma event.ba djeluje kao posrednik u prodaji ulaznica i drugih proizvoda/usluga koje organizatori događaja nude. Ulaznice kupljene putem platforme izdaju se na ime kupca ili prema specifikacijama koje kupac navede. Važno je napomenuti da platforma event.ba nije vlasnik proizvoda/usluga niti se nalazi u posjedu istih. Ona pruža sučelje za olakšanu komunikaciju između organizatora događaja i korisnika.
        `}
      />
      <PageRow
        heading="Plaćanje"
        content={`Platforma event.ba omogućava korisnicima kupovinu putem različitih bankovnih kartica. Procesiranje plaćanja odvija se putem Monri sustava, koji je ovlašten od strane platforme event.ba za obavljanje ove funkcije. Kupci mogu koristiti kartice kao što su American Express®, MasterCard®, Maestro®, Visa i Diners.
        `}
      />
      <PageRow
        heading="Korištenje ulaznica"
        content={`Kupci su odgovorni za čuvanje i pravilno korištenje ulaznica koje su nabavili putem platforme event.ba. Ulaznice su personalizirane i povezane s imenom kupca ili informacijama koje je kupac naveden. Prema pravilima platforme event.ba, ulaznice ne smiju biti ustupljene trećim osobama niti se smiju kopirati. Kupci su svjesni da je u slučaju krađe ulaznice ili njenih podataka, moguće da druga osoba iskoristi tu ulaznicu.
        `}
      />
      <PageRow
        heading="Povrat novca i pritužbe"
        content={`Platforma event.ba nije organizator događaja niti direktno odgovorna za povrat novca. Međutim, platforma će surađivati s organizatorima kako bi osigurala povrat novca u slučaju otkazivanja događaja ili značajnih promjena u programu. Povrat novca je moguć samo u određenim situacijama, kao što su otkazivanje događaja ili promjene u programu. Važno je napomenuti da povrat novca nije moguć iz osobnih razloga kao što su bolest ili promjena planova.
        `}
      />
    </div>
  );
};
