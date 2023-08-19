import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import UserManagerIcon from '../../../assets/ikonice/user_manager_icon.svg';
import CheckIcon from '../../../assets/ikonice/check2_icon.svg';
import TrashCan from '../../../assets/ikonice/trash_can.svg';
import BanIcon from '../../../assets/ikonice/ban_user_icon.svg';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const ResellerRequestsCard = ({
  data,
  i,
  setRequestsData,
  requestsData,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [hasBorderRadius, setBorderRadius] = useState(true);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef(null);
  const [arrowDisabled, disableArrow] = useState(false);

  useEffect(() => {
    // Get the height of the dropdown content
    setDropdownHeight(dropdown ? dropdownRef.current.scrollHeight : 0);

    if (!dropdown) {
      setTimeout(() => {
        setBorderRadius(dropdown ? false : true);
      }, 200);
      return;
    }
    setBorderRadius(dropdown ? false : true);
  }, [dropdown]);

  // Toggle dropdown
  function toggleDropdown() {
    setDropdown(!dropdown);

    // Disable arrow on 0.4 sec so user cannot spam
    disableArrow(true);
    setTimeout(() => {
      disableArrow(false);
    }, 400);
  }

  // Set Reseller
  function setReseller() {
    axios
      .patch(
        process.env.REACT_APP_API_URL + `/api/v1/users/set_reseller/${data._id}`
      )
      .then((response) => {
        setRequestsData(requestsData.filter((user) => user._id !== data._id));
        toast.success(response.data.message, toastSetup('top-right', 3000));
      })
      .catch((error) => {});
  }

  function deleteReseller() {
    axios
      .patch(
        process.env.REACT_APP_API_URL +
          `/api/v1/users/remove_reseller_request/${data._id}`
      )
      .then((response) => {
        setRequestsData(requestsData.filter((user) => user._id !== data._id));
        toast.success(response.data.message, toastSetup('top-right', 3000));
      })
      .catch((error) => {});
  }

  function banUser() {
    axios
      .patch(
        process.env.REACT_APP_API_URL + `/api/v1/users/set_ban/${data._id}/true`
      )
      .then(() => {
        // Display messages and update ban status
        toast.success(
          'Uspješno ste blokirali korisnika',
          toastSetup('top-right', 2000)
        );
        setRequestsData(requestsData.filter((user) => user._id !== data._id));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div
      style={{
        borderBottomLeftRadius: hasBorderRadius ? '7px' : '0',
        borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
        marginBottom: dropdown ? dropdownHeight + 30 : '10px',
      }}
      className="myevent-card"
    >
      <img className="user" src={UserManagerIcon} alt="User" />
      <div className="myevent-card-part-2">
        <p>
          {data.full_name.split(' ')[0]} {data.full_name.split(' ')[1]}
        </p>
      </div>
      <div className="line"></div>
      <div className="myevent-card-part-2">
        <p>{data.email}</p>
      </div>
      <div
        onClick={(e) => (!arrowDisabled ? toggleDropdown(e) : undefined)}
        className="myevent-card-part-3"
        style={{
          borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
          backgroundColor: hasBorderRadius
            ? 'rgba(69, 91, 217, 0.7)'
            : 'rgba(69, 91, 217, 0.5)',
        }}
      >
        <p>Prikaži zahtjev</p>
        <img
          style={dropdown ? { rotate: '-180deg' } : { rotate: '0deg' }}
          className="dropdown-arrow"
          src={ArrowIcon}
          alt="Drop"
        />
      </div>
      <Tooltip
        style={{
          borderRadius: '10px',
          backgroundColor: '#455cd9',
          zIndex: '9999',
        }}
        anchorId={`approve-request${i}`}
        place="bottom"
        variant="info"
        content="Prihvati zahtjev"
      />
      <Tooltip
        style={{
          borderRadius: '10px',
          backgroundColor: '#455cd9',
          zIndex: '9999',
        }}
        anchorId={`delete-request${i}`}
        place="bottom"
        variant="info"
        content="Obriši zahtjev"
      />
      <Tooltip
        style={{
          borderRadius: '10px',
          backgroundColor: '#455cd9',
          zIndex: '9999',
        }}
        anchorId={`block-user${i}`}
        place="bottom"
        variant="info"
        content="Blokiraj korisnika sa platforme"
      />
      <div
        style={{ maxHeight: dropdown ? dropdownHeight + 20 : 0 }}
        className="myevents-card-dropdown resellers-list-dropdown"
        ref={dropdownRef}
      >
        <div className="reseller-dropdown-part">
          <div>
            <p>Ime:</p>
            <p>{data.full_name.split(' ')[0]}</p>
          </div>
          <div>
            <p>Prezime:</p>
            <p>{data.full_name.split(' ')[1]}</p>
          </div>
          <div>
            <p>Email:</p>
            <p>{data.email}</p>
          </div>
          <div>
            <p>Adresa:</p>
            <p>{data.address}</p>
          </div>
          <div>
            <p>Grad:</p>
            <p>{data.city}</p>
          </div>
          <div>
            <p>Država:</p>
            <p>{data.country}</p>
          </div>
        </div>
        <div className="reseller-dropdown-part">
          <div>
            <p>Naziv prodajnog mjesta</p>
            <p>{data.reseller_info.sellingPlaceName}</p>
          </div>
          <div>
            <p>Adresa prodajnog mjesta</p>
            <p>{data.reseller_info.sellingPlaceAddress}</p>
          </div>
          <div>
            <p>Telefon prodajnog mjesta</p>
            <p>{data.reseller_info.sellingPlaceNumber}</p>
          </div>
        </div>
        <div className="reseller-dropdown-part">
          <div
            onClick={() => {
              setReseller();
            }}
            id={`approve-request${i}`}
          >
            <img src={CheckIcon} alt="Check" />
          </div>
          <div
            onClick={() => {
              deleteReseller();
            }}
            id={`delete-request${i}`}
          >
            <img src={TrashCan} alt="Delete" />
          </div>
          <div
            onClick={() => {
              banUser();
            }}
            id={`block-user${i}`}
          >
            <img src={BanIcon} alt="Ban" />
          </div>
        </div>
      </div>
    </div>
  );
};
