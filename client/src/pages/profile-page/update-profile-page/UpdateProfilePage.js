import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Encrypt } from '../../../auth/Encrypt';
import axios from 'axios';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-number-input';
import hr from '../../../components/helper/hr';
import countryMap from '../../../components/helper/countryMap';
import { toastSetup } from '../../../functions/toastSetup';
import { UpdateProfileInput } from './UpdateProfileInput';
import X from '../../../assets/ikonice/X2.svg';
import Check from '../../../assets/ikonice/check2_icon.svg';
import TrashCan from '../../../assets/ikonice/trash_can.svg';
import { setUserID } from '../../../store/userSlice';
import { useNavigate } from 'react-router-dom';

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
  const [isModalVisible, setModalVisibility] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    if (
      password !== '' &&
      (password.length < 6 || password !== repatePassword)
    ) {
      if (password.length < 6) {
        toast.warn(
          'Lozinka mora imati barem 6 znakova!',
          toastSetup('top-right', 2000)
        );
      } else if (password !== repatePassword) {
        toast.warn('Lozinke se ne podudaraju!', toastSetup('top-right', 2000));
      }
      return;
    }

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

    const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/users/${id}`;

    try {
      await axios.patch(apiUrl, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success(
        'Uspješno ste ažurirali podatke',
        toastSetup('top-right', 2000)
      );
      props.onProfileFormSubmit();
    } catch (error) {
      console.error(error);

      const errorMessage = error.response?.data?.msg || 'Nepoznata pogreška.';
      toast.error(
        `Došlo je do pogreške prilikom ažuriranja podataka. ${errorMessage}!`,
        toastSetup('top-right', 2000)
      );
    }
  };

  function deleteUserProfile() {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/v1/users/delete_user/${id}`)
      .then((response) => {
        toast.success(
          `${response.data.message}`,
          toastSetup('top-right', 2000)
        );
        setModalVisibility(true);
        dispatch(setUserID(''));
        localStorage.clear();
        navigate('/');
      })
      .catch((error) => {
        toast.success(
          `${error.response.data.message}`,
          toastSetup('top-right', 2000)
        );
      });
  }

  return (
    <form className="form container smaller-profile" onSubmit={handleSubmit}>
      {isModalVisible ? (
        <>
          <div className="modal-window">
            <h6>Jeste li sigurni da želite obrisati profil?</h6>
            <div>
              <a onClick={deleteUserProfile} href="#">
                Da <img src={Check} alt="Check" />
              </a>
              <a
                onClick={() => {
                  setModalVisibility(false);
                }}
                href="#"
              >
                Ne <img src={X} alt="X" />
              </a>
            </div>
          </div>
          <div
            onClick={() => {
              setModalVisibility(false);
            }}
            className="blur"
          ></div>
        </>
      ) : (
        ''
      )}
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
      <div className="row profile-btns-row">
        <button type="submit">Spremi promjene</button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setModalVisibility(true);
          }}
        >
          Obriši profil <img src={TrashCan} alt="Obrisi" />
        </button>
      </div>
    </form>
  );
};
