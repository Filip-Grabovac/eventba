import React from 'react';
import { PageRow } from '../info-pages-parts/PageRow';

export const Help = ({ heading }) => {
  return (
    <div className="info-page">
      <h4>{heading}</h4>
      <PageRow
        heading="Početak"
        content={`Kada odaberete željeni događaj, započnite proces kupovine. Ne brinite, vaša će narudžba biti naplaćena tek na kraju postupka, kada potvrdite kupovinu. Ukupan iznos se naplaćuje samo kada narudžba uspješno bude izvršena i kada vam ulaznice budu poslane. UPOZORENJE: Odabrane ulaznice privremeno su rezervirane 24 minute u vašoj košarici za kupovinu, nakon čega će rezervacija isteći.
        `}
      />
      <PageRow
        heading="Kupovina preko planiranog sjedala"
        content={`Za određene događaje možete direktno odabrati sjedala iz interaktivnog plana dvorane. Koristite navigacijski alat da biste odabrali željeni dio sjedala i koristite "+" i "-" za promjenu nivoa zumiranja. Sada jednostavno možete odabrati sjedalo/sjedala klikom na odgovarajuće mjesto/mjesta. Nastavite s vašom narudžbom klikom na gumb "Pregled košarice", kako biste bili preusmjereni na stranicu s metodama isporuke.
        `}
      />
      <PageRow
        heading="Informacije o načinu dostave"
        content={`Na ovoj stranici moći ćete odabrati način dostave (E-ulaznica, Mobilna ulaznica, Poštanska isporuka, Preuzimanje na blagajni...). Kliknite na gumb ispod "Nastavi" kako biste nastavili na stranicu za potrebne podatke.
        `}
      />
      <PageRow
        registracija
        heading="Informacije o kupcu "
        content={`Sada ćete biti preusmjereni na stranicu s obrascem za unos potrebnih podataka (e-mail adresa, ime, prezime, broj telefona, zemlja, grad, poštanski broj, adresa). Unesite tražene podatke. Ako već imate račun, pređite na opciju "Već imate račun? Prijavite se" i unesite prethodno odabranu lozinku. Ako ste zaboravili lozinku, kliknite na vezu "Zaboravljena lozinka". Ako ste zaboravili lozinku, ostavite e-mail adresu kojom ste se registrirali i kliknite gumb "Pošalji". Upotrijebite vezu koja će vam biti poslana na vašu e-mail adresu kako biste kreirali novu lozinku.

        Ako želite odabrati različitu adresu za fakturiranje (npr. za kompaniju) od adrese dostave, molimo vas da pošaljete e-mail na adresu office@event.ba.
        
        U svakom trenutku možete uređivati stavke u košarici (dodavati, brisati, mijenjati...). Da biste pristupili svojoj košarici za kupovinu, kliknite na simbol "košarica" na vrhu stranice.
        
        Kliknite na gumb ispod "Nastavi" kako biste nastavili postupak.
        `}
      />
      <PageRow
        heading="Informacije o narudžbi/načnu plaćanja"
        content={`Na ovoj stranici ćete pronaći pregled narudžbe i moći ćete odabrati način plaćanja (Plaćanje karticom). Nakon prihvaćanja uvjeta korištenja, kliknite na polje "Plaćanje" kako biste bili preusmjereni na stranicu za plaćanje.
        `}
      />
      <PageRow
        heading="Plaćanje"
        content={`Na ovoj koraci bit ćete preusmjereni na stranicu pružatelja usluge plaćanja. Plaćanje je moguće izvršiti sljedećim karticama: Visa, Mastercard i American Express. Više informacija o načinima plaćanja možete pronaći ovdje. Molimo vas da ne zatvarate preglednik dok se rezultat narudžbe ne pojavi na web stranici.
        `}
      />
      <PageRow
        heading="Potvrda kupnje"
        content={`Sada ćete primiti obavijest da je vaša narudžba uspješno obavljena, zajedno s poveznicom koja vodi do vaših ulaznica. U idućih nekoliko minuta primit ćete i e-mail potvrdu da je vaša narudžba uspješno izvršena. Potvrda će također sadržavati poveznicu do vaših ulaznica.
        `}
      />
    </div>
  );
};
