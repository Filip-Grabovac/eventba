import React, { useEffect, useRef, useState } from 'react';
import ArrowIcon from '../../../assets/ikonice/arrow_icon.svg';
import UserManagerIcon from '../../../assets/ikonice/user_manager_icon.svg';
import CheckIcon from '../../../assets/ikonice/check2_icon.svg';
import TrashCan from '../../../assets/ikonice/trash_can.svg';
import BanIcon from '../../../assets/ikonice/ban_user_icon.svg';
import { Tooltip } from 'react-tooltip';

export const ResellerRequestsCard = () => {
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
  function toggleDropdown(e) {
    setDropdown(!dropdown);

    // Disable arrow on 0.4 sec so user cannot spam
    disableArrow(true);
    setTimeout(() => {
      disableArrow(false);
    }, 400);
  }

  return (
    <div
      style={{
        borderBottomLeftRadius: hasBorderRadius ? '7px' : '0',
        borderBottomRightRadius: hasBorderRadius ? '7px' : '0',
        marginBottom: dropdown ? dropdownHeight + 10 : '10px',
      }}
      className="myevent-card"
    >
      <img className="user" src={UserManagerIcon} alt="User" />
      <div className="myevent-card-part-2">
        <p>Matija Cvek</p>
      </div>
      <div className="line"></div>
      <div className="myevent-card-part-2">
        <p>matija123@gmail.com</p>
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
        anchorId="approve-request"
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
        anchorId="delete-request"
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
        anchorId="block-user"
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
            <p>Matija</p>
          </div>
          <div>
            <p>Prezime:</p>
            <p>Cvek</p>
          </div>
          <div>
            <p>Email:</p>
            <p>matija123@gmail.com</p>
          </div>
          <div>
            <p>Adresa:</p>
            <p>Trnovaca b.b.</p>
          </div>
          <div>
            <p>Grad:</p>
            <p>Uskoplje</p>
          </div>
          <div>
            <p>Država:</p>
            <p>BiH</p>
          </div>
        </div>
        <div className="reseller-dropdown-part">
          <div>
            <p>Naziv prodajnog mjesta</p>
            <p>Caffe Avatar</p>
          </div>
          <div>
            <p>Adresa prodajnog mjesta</p>
            <p>Gornji Vakuf - Uskoplje </p>
          </div>
          <div>
            <p>Telefon prodajnog mjesta</p>
            <p>063 123 456</p>
          </div>
        </div>
        <div className="reseller-dropdown-part">
          <div id="approve-request">
            <img src={CheckIcon} alt="Check" />
          </div>
          <div id="delete-request">
            <img src={TrashCan} alt="Delete" />
          </div>
          <div id="block-user">
            <img src={BanIcon} alt="Ban" />
          </div>
        </div>
      </div>
    </div>
  );
};
