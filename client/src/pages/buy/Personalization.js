import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { addTicket } from '../../store/ticketSlice';
import { PlanWrapper } from './PlanWrapper';
import { Tooltip } from 'react-tooltip';
import { addTicketPrice } from '../../store/ticketSlice';
import HallTickets from './ticket-type/HallTickets';
export const Personalization = ({
  i,
  setShowPaymentForm,
  profileData,
  concertData,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState(profileData?.name || '');
  const [surname, setSurname] = useState(profileData?.lname || '');
  const [email, setEmail] = useState(profileData?.email || '');
  const [ticketPrice, setTicketPrice] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const dispatch = useDispatch();
  const ticketID = i + 1;

  useEffect(() => {
    if (profileData) {
      setName('');
      setSurname('');
      setEmail(profileData.email || '');
    }
  }, [profileData]);

  useEffect(() => {
    const ticket = {
      id: ticketID,
      name: name,
      lname: surname,
      email: email,
      price: 0,
    };

    setShowPaymentForm(false);
    dispatch(addTicket(ticket));
  }, [ticketID, name, surname, email, dispatch]);

  const handleClick = async (category) => {
    setActiveCategory(category);
    setShowPaymentForm(false);
    const ticketType = concertData.tickets.online_sale.type[category];
    const price = ticketType.price;

    await setTicketPrice(price);
    dispatch(
      addTicketPrice({
        ticketPrice: Number(price),
        ticketID,
        category,
        name: ticketType.name,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const curentTicket = useSelector((state) =>
    state.ticketState.ticketList.find((ticket) => ticket.id === ticketID)
  );

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className="personalization">
      <div className="person-check-flex">
        <h4 className="">Personalizacija</h4>

        <input
          id={`checkbox-${i}`}
          className="checkbox"
          onChange={handleCheckboxChange}
          type="checkbox"
          name="checkbox"
        />
        <Tooltip
          style={{ borderRadius: '10px', backgroundColor: '#455cd9' }}
          anchorId={`checkbox-${i}`}
          place="top"
          variant="info"
          content="Presonalizirajte ulaznicu."
        />
      </div>
      {isChecked ? (
        <div className="profile-form">
          <form className="form container" onSubmit={handleSubmit}>
            <div className="row">
              <div className="item1 col">
                <input
                  disabled={!isChecked}
                  placeholder="Ime"
                  type="text"
                  id={`name-${i}`}
                  value={!isChecked ? '' : name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <Tooltip
                style={{ borderRadius: '10px', backgroundColor: '#455cd9' }}
                anchorId={`name-${i}`}
                place="top"
                variant="info"
                content={`Ime vlasnika ulaznice ${i + 1}`}
              />
              <div className="item2 col">
                <input
                  disabled={!isChecked}
                  placeholder="Prezime"
                  type="text"
                  id="surname"
                  value={!isChecked ? '' : surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="item3 col">
                <input
                  placeholder="Email"
                  type="email"
                  id={`email-${i}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Tooltip
                  style={{ borderRadius: '10px', backgroundColor: '#455cd9' }}
                  anchorId={`email-${i}`}
                  place="bottom"
                  variant="info"
                  content={`Email za ulaznicu ${i + 1}`}
                />
              </div>
            </div>
          </form>
        </div>
      ) : (
        ''
      )}

      <h4 className="choose-place">Odaberi ulaznicu:</h4>
      {concertData?.place?.type === 'hall' ? (
        <HallTickets
          concertData={concertData}
          activeCategory={activeCategory}
          handleClick={handleClick}
        />
      ) : (
        <>
          <PlanWrapper ticketID={ticketID} />
          <h4 className="choose-place">
            {`Cijena ulaznice: ${curentTicket ? curentTicket.price : 0}`}{' '}
            <small> BAM</small>
          </h4>
        </>
      )}
    </div>
  );
};
