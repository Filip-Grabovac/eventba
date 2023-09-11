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
        Adresa: Poštanski broj 96-2, 72250 Vitez 
        <br />  
        Registracijski broj: 51-01-0045-10
        <br />
        Porezni broj: 4236501340004
        <br />
        Žiro račun: 338 250 228 767 98 60 
        UniCredit BANK 
        <br />
        Web adresa: https://www.event.ba
        <br />
        Email: info@event.ba
      `}
      />

      <PageRow
        heading="Kontakt centar"
        content={`Sve informacije u vezi s kupovinom ulaznica, povratom novca za otkazane/odgođene događaje, promjenom lokacije događaja i drugim općim informacijama možete dobiti putem e-maila.
        <br />
        E-mail: info@event.ba
      `}
      />
    </div>
  );
};
