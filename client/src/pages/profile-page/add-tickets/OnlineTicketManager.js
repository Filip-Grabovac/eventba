import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { toastSetup } from "../../../functions/toastSetup";
import { toast } from "react-toastify";
import { setLoginIsOpen } from "../../../store/loginSlice";
import { useDispatch, useSelector } from "react-redux";

const OnlineTicketManager = ({ onlineSale, id }) => {
  const [saleData, setSaleData] = useState(onlineSale);
  const [amountToAddValues, setAmountToAddValues] = useState({});
  const newZoneNameRef = useRef();
  const nameRef = useRef();
  const maxAmountRef = useRef();
  const priceRef = useRef();
  const token = useSelector((state) => state.userState.token);
  const dispatch = useDispatch();

  const handleAddTickets = (zoneName) => {
    setSaleData((prevData) => {
      const realAmountToAdd =
        prevData.zones[zoneName].amount + Number(amountToAddValues[zoneName]) <
        0
          ? Number(-prevData.zones[zoneName].amount)
          : Number(amountToAddValues[zoneName]);

      const newAmount = prevData.zones[zoneName].amount + realAmountToAdd;
      const newMaxAmount =
        prevData.zones[zoneName].max_amount + realAmountToAdd;

      return {
        ...prevData,
        zones: {
          ...prevData.zones,
          [zoneName]: {
            ...prevData.zones[zoneName],
            amount: newAmount,
            max_amount: newMaxAmount,
          },
        },
        total_amount_left: prevData.total_amount_left + realAmountToAdd,
      };
    });
  };

  const handleRemoveTickets = (zoneName) => {
    setSaleData((prevData) => {
      const amountToRemove = Number(prevData.zones[zoneName].amount);

      return {
        ...prevData,
        zones: {
          ...prevData.zones,
          [zoneName]: {
            ...prevData.zones[zoneName],
            amount: 0,
            max_amount: prevData.zones[zoneName].max_amount - amountToRemove,
          },
        },
        total_amount_left: prevData.total_amount_left - amountToRemove,
      };
    });
  };

  const handleAddNewZone = async () => {
    const newZoneName = newZoneNameRef.current.value;
    const name = nameRef.current.value;
    const maxAmount = maxAmountRef.current.value;
    const price = priceRef.current.value;

    if (newZoneName && name && maxAmount && price) {
      // Provjeri je li newZoneName već prisutan u drugim zonama
      if (saleData.zones[newZoneName]) {
        toast.error(
          "Zona s istim imenom već postoji.",
          toastSetup("top-right", 3000)
        );
        return;
      }

      setSaleData((prevData) => {
        return {
          ...prevData,
          zones: {
            ...prevData.zones,
            [newZoneName]: {
              name: name,
              amount: Number(maxAmount),
              max_amount: Number(maxAmount),
              price: Number(price),
            },
          },
          total_amount_left: prevData.total_amount_left + Number(maxAmount),
        };
      });

      newZoneNameRef.current.value = "";
      nameRef.current.value = "";
      maxAmountRef.current.value = "";
      priceRef.current.value = "";
    } else {
      toast.warn(
        "Molimo unesite sve podatke ulaznica.",
        toastSetup("top-right", 3000)
      );
    }
  };

  useEffect(() => {
    setSaleData(onlineSale);
  }, [onlineSale]);

  const handleSave = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/v1/concerts/update_online_sale",
        {
          id,
          onlineSaleData: saleData,
          token,
        }
      );
      toast.success(response?.data.message, toastSetup("top-center", 1500));
    } catch (error) {
      if (error?.response.status === 401) {
        dispatch(setLoginIsOpen(true));
      }
      toast.error(error?.response.data.message, toastSetup("top-center", 3000));
    }
  };

  if (!saleData) {
    return <div>Loading...</div>;
  }

  return (
    onlineSale && (
      <>
        {Object.keys(saleData.zones).map((zoneName) => (
          <div className="zone-card-container-wrapper" key={zoneName}>
            <div className="zone-info">
              <div className="zone-name">
                {zoneName} - {saleData.zones[zoneName].name}
              </div>
              <div className="zone-left">
                Preostalo: {saleData.zones[zoneName].amount}/
                {saleData.zones[zoneName].max_amount}
              </div>
              <div>
                Cijena: {saleData.zones[zoneName].price} <small>BAM</small>
              </div>
            </div>
            <input
              className="zone-input"
              type="number"
              placeholder="Broj"
              value={amountToAddValues[zoneName]}
              onChange={(e) =>
                setAmountToAddValues((prevValues) => {
                  const updatedValues = { ...prevValues };
                  updatedValues[zoneName] = Number(e.target.value);
                  return updatedValues;
                })
              }
            />
            <button
              className="zone-add"
              onClick={() => handleAddTickets(zoneName)}
            >
              Dodaj ulaznice
            </button>
            <button
              className="zone-stop"
              onClick={() => handleRemoveTickets(zoneName)}
            >
              Zaustavi prodaju
            </button>
          </div>
        ))}
        <div className="zone-new-zone">
          <input type="text" placeholder="Ime zone" ref={newZoneNameRef} />
          <input type="text" placeholder="Tip" ref={nameRef} />
          <input type="number" placeholder="Broj ulaznica" ref={maxAmountRef} />
          <input type="number" placeholder="Cijena" ref={priceRef} />
          <button onClick={handleAddNewZone}>Dodaj novu zonu</button>
          <button onClick={handleSave}>Spremi promjene </button>
        </div>
      </>
    )
  );
};

export default OnlineTicketManager;
