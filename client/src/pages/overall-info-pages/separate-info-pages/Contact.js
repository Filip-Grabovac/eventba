import React from 'react';
import { PageRow } from '../info-pages-parts/PageRow';

export const Contact = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Event.ba"
        content={`Naziv pravnog lica: **NAZIV** 
        <br />
        Adresa: **ADRESA**
        <br />
        Delatnost i šifra delatnosti: **INFO**
        <br />
        Matični broj: **MATICNI**
        <br />
        PIB: **PIB**
        <br />
        Web adresa: www.event.ba 
        <br />
        Email: **EMAIL**
      `}
      />
      <PageRow
        heading="Call centar"
        content={`Cijena poziva iz fiksne i mobilne mreže MTS-a iznosi 48,00 dinara po minuti. Porez je uključen u cijenu poziva.
        Radno vrijeme: ponedjeljak – petak od 10:00 do 16:00 sati (subota i nedjelja - neradni dani).
        Email: callcenter@event.ba
      `}
      />
      <PageRow
        heading="Kontakt centar"
        content={`Sve informacije u vezi s kupovinom ulaznica, povratom novca za otkazane/odgođene događaje, promjenom lokacije događaja i drugim općim informacijama možete dobiti putem e-maila.
        E-mail: kontakt@event.ba
      `}
      />
    </div>
  );
};
