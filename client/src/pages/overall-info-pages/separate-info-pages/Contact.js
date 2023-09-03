import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";

export const Contact = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Event.ba"
        content={`
        Naziv pravnog lica: "INVENT" Društvo s ograničenom odgovornošću Vitez
        <br />
        Adresa: Poštanski broj 962
        <br />
        Poštanski ured i mjesto: 72250 VITEZ
        <br />
        Županija: Srednjobosanski kanton
        <br />
        Registracijski broj: 51-01-0045-10
        <br />
        Porezni broj: 4236501340004
        <br />
        Žiro račun: BA391610550019610037
        RAIFFEISEN BANK d.d. Bosna i Hercegovina
        <br />
        Zastupnik: Matić Anto
        <br />
        Web adresa: www.event.ba
        <br />
        Email: event.ba.mailer@gmail.com
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
