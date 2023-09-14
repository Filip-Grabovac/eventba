import React from "react";
import { PageRow } from "../info-pages-parts/PageRow";

export const DataDeletion = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Upute za brisanje korisničkog računa"
        content={`Prijavite se na svoj korisnički račun koristeći svoje korisničko ime i lozinku.
<br />
Nakon što ste se prijavili, idite na svoj profil. To možete učiniti tako da kliknete na ikonicu u gornjem desnom kutu stranice. Nakon klika na tu ikonicu prikazati će se gumb "Profil". Klikom na "Profil" otvorit će se korisničko sučelje.
<br />
U profilu potražite opciju "Ažuriraj podatke". Gumb za brisanje računa se nalazi na dnu ove sekcije.
<br />
Kliknite na gumb za brisanje računa.
<br />
Potvrdite svoj zahtjev za brisanjem računa kliknom na gumb "Da"
<br />
Nakon što je postupak brisanja završen, bit ćete odjavljeni s računa, a vaš korisnički račun bit će obrisan. Svi podaci povezani s vašim korisničkim računom bit će trajno izbrisani. To uključuje vašu email adresu, povijest kupovanja i sve ostale osobne podatke.
        `}
      />
    </div>
  );
};
