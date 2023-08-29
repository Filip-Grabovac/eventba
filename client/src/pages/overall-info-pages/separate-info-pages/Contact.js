import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";

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
        heading="Kontakt centar"
        content={`Sve informacije u vezi s kupovinom ulaznica, povratom novca za otkazane/odgođene događaje, promjenom lokacije događaja i drugim općim informacijama možete dobiti putem e-maila.
        <br />
        E-mail: event.ba.mailer@gmail.com
      `}
      />
    </div>
  );
};
