import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";

export const Help = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Početak"
        content={`Kada odaberete željeni događaj, započnite proces kupovine. Ne brinite, vaša će narudžba biti naplaćena tek na kraju postupka, kada potvrdite kupovinu preko "Monri" online sustava plaćanja. Ukupan iznos se naplaćuje samo kada narudžba uspješno bude izvršena i kada vam ulaznice budu poslane.
        `}
      />

      <PageRow
        heading="Informacije o načinu dostave"
        content={`Na ovoj stranici moći ćete odabrati e-mail na koji će ulaznica biti poslana. Kliknite na gumb "Personaliziraj" kako biste personalizirali ulaznicu na ime i prezime vlasnika i unijeli e-mail adresu na koju će ulaznica biti poslana.
        `}
      />

      <PageRow
        heading="Informacije o načnu plaćanja"
        content={`Na ovoj stranici ćete pronaći pregled narudžbe i moći ćete odabrati način plaćanja (Plaćanje karticom). Prihvaćate uvjeta korištenja prilikom registracije na event.ba, kliknite na polje "Idi na plaćanje" kako biste bili preusmjereni na stranicu za plaćanje.
        `}
      />
      <PageRow
        heading="Plaćanje"
        content={`Na ovoj koraci bit ćete preusmjereni na stranicu pružatelja usluge plaćanja. Plaćanje je moguće izvršiti sljedećim karticama: Visa, Mastercard i American Express. Više informacija o načinima plaćanja možete pronaći klikom na gumb na dnu prozora "Način plaćanja". Molimo vas da ne zatvarate preglednik dok se poruka o uspješnoj narudžbi ne pojavi.
        `}
      />
      <PageRow
        heading="Potvrda kupnje"
        content={`Ako su narudžba i transakcija uspješno izvršeni u roku par sekundi dobiti će te e-mail s Vašom ulaznicom u privitku. To je jedini primjerak ulaznice, zato Vas molimo da je ne dijelite u javnosti.
        `}
      />
    </div>
  );
};
