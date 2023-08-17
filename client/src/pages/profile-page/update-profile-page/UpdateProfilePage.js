import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Encrypt } from '../../../auth/Encrypt';
import axios from 'axios';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-number-input';
import hr from '../../../components/helper/hr';
import countryMap from '../../../components/helper/countryMap';
import { toastSetup } from '../../../functions/toastSetup';
import { UpdateProfileInput } from './UpdateProfileInput';

export const UpdateProfilePage = (props) => {
  const profileData = props.profileData;
  const [name, setName] = useState(profileData.full_name.split(' ')[0]);
  const [lname, setLname] = useState(profileData.full_name.split(' ')[1]);
  const [email, setEmail] = useState(profileData.email);
  const [city, setCity] = useState(profileData.city);
  const [zip, setZip] = useState(profileData.zip);
  const [address, setAddress] = useState(profileData.address);
  const [password, setPassword] = useState('');
  const [repatePassword, setRepatePassword] = useState('');

  const [phone, setPhone] = useState(profileData.phone);
  const reverseCountry = (full_name) => {
    for (const code in countryMap) {
      if (countryMap[code] === full_name) {
        return code;
      }
    }
    return null;
  };
  const [country, setCountry] = useState(
    reverseCountry(profileData.country) || 'BA'
  );
  const id = useSelector((state) => state.userState.user);
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      full_name: name + ' ' + lname,
      email: email,
      address: address,
      city: city,
      country: countryMap[country],
      zip: zip,
      phone: phone,
      password: password !== '' ? Encrypt(password, secretKey) : undefined,
    };

    if (
      password !== '' &&
      password.length >= 6 &&
      password === repatePassword
    ) {
      await axios
        .patch(process.env.REACT_APP_API_URL + `/api/v1/users/${id}`, user, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          toast.success(
            'Uspješno ste ažurirali podatke',
            toastSetup('top-right', 2000)
          );
          props.onProfileFormSubmit();
        })
        .catch((error) => {
          // Handle any errors
          console.error('Error:');
          toast.error(
            `Došlo je do pogreške prilikom ažuriranja podataka. ${error.response.data.error}!`,
            toastSetup('top-right', 2000)
          );
        });
    } else if (password === '') {
      // Ako je lozinka prazna, samo se ažuriraju ostali podaci
      await axios
        .patch(process.env.REACT_APP_API_URL + `/api/v1/users/${id}`, user, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          toast.success(
            'Uspješno ste ažurirali podatke',
            toastSetup('top-right', 2000)
          );
          props.onProfileFormSubmit();
        })
        .catch((error) => {
          // Handle any errors
          console.error('Error:');
          toast.error(
            `Došlo je do pogreške prilikom ažuriranja podataka. ${error.response.data.error}!`,
            toastSetup('top-right', 2000)
          );
        });
    } else {
      toast.warn(
        'Lozinke se ne podudaraju ili su kraće od 6 znamenki!',
        toastSetup('top-right', 2000)
      );
    }
  };

  return (
    <form className="form container smaller-profile" onSubmit={handleSubmit}>
      <div className="row">
        <UpdateProfileInput
          placeholder="Ime"
          id="name"
          inputValue={name}
          setValue={setName}
        />
        <UpdateProfileInput
          placeholder="Prezime"
          id="lname"
          inputValue={lname}
          setValue={setLname}
        />
      </div>
      <div className="row">
        <UpdateProfileInput
          placeholder="Email"
          id="email"
          inputValue={email}
          setValue={setEmail}
        />
      </div>
      <div className="row">
        <UpdateProfileInput
          placeholder="Grad"
          id="city"
          inputValue={city}
          setValue={setCity}
        />
        <UpdateProfileInput
          placeholder="Zip"
          id="zip"
          inputValue={zip}
          setValue={setZip}
        />
      </div>
      <div className="row">
        <div className="phone-col col">
          <PhoneInput
            placeholder="Mobitel"
            value={phone || ''}
            onChange={setPhone}
            onCountryChange={setCountry}
            defaultCountry={country || 'BA'}
            international={true}
            countryCallingCodeEditable={false}
            label={country}
            countryOptionsOrder={[
              'BA',
              'HR',
              'RS',
              'AL',
              'BG',
              'GR',
              'XK',
              'ME',
              'MK',
              'RO',
              'SI',
              'DE',
              'AT',
              'IT',
            ]}
            labels={hr}
            locales="hr"
          />
        </div>
      </div>
      <div className="row">
        <UpdateProfileInput
          placeholder="Adresa"
          id="address"
          inputValue={address}
          setValue={setAddress}
        />
      </div>
      <div className="row">
        <UpdateProfileInput
          placeholder="Nova lozinka"
          id="password"
          inputValue={password}
          setValue={setPassword}
        />

        <UpdateProfileInput
          placeholder="Ponovi lozinku"
          id="repatePassword"
          inputValue={repatePassword}
          setValue={setRepatePassword}
        />
      </div>
      <div className="row">
        <button type="submit">Spremi promjene</button>
      </div>
    </form>
  );
};
