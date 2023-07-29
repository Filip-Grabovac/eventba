import React from 'react';

export const RequestReseller = () => {
  return (
    <div className="request-resseler-container">
      <form action="">
        <input type="text" placeholder="Naziv prodajnog mjesta" />
        <input type="text" placeholder="Adresa prodajnog mjesta" />
        <input type="text" placeholder="Telefon prodajnog mjesta" />
        <button type="submit">Pošalji</button>
        <p>
          Nakon što pošaljete zahtjev za preprodavača, admin će obraditi vaš
          zahtjev
        </p>
      </form>
    </div>
  );
};
