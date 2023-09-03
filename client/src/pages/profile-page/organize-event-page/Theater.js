import React, { useEffect, useState } from 'react';
import ImageMapper, { Mode } from '../../draw-place/image-mapper/ImageMapper';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const Theater = ({ placeData, setRows, rows }) => {
  const [groundPlanImg, setImg] = useState(null);
  const [modalWindow, setModalWindow] = useState(false);
  const [selectedZoneData, setSelectedZoneData] = useState();
  const [selectedZone, setSelectedZone] = useState([]);
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Regular');

  // Load ground image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/static/ground-plans/${placeData.ground_plan}`
        );

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Create an image element to calculate its dimensions
        const imgElement = new Image();

        // Set up the onload event handler
        imgElement.onload = () => {
          setImg({
            src: imageUrl,
            width: imgElement.width,
            height: imgElement.height,
          });
        };

        // Set the src AFTER defining the onload handler
        imgElement.src = imageUrl;
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadImage();
  }, [placeData]);

  // Zone click
  function handleZoneClick(e, zoneData) {
    setModalWindow(true);
    setSelectedZoneData(zoneData);
    if (document.querySelector('.highlighted'))
      document.querySelector('.highlighted').classList.remove('highlighted');
    e.target.classList.add('highlighted');
  }

  // Save zone
  function saveZone(e) {
    e.preventDefault();
    const isCheckboxChecked = document.querySelector(
      '.disable-zone-checkbox'
    ).checked;
    let seatNumbersArray;
    let zoneKey = selectedZoneData[0];

    if (isCheckboxChecked) {
      seatNumbersArray = [];
      document.getElementById(`${zoneKey}`).classList.remove('done');
    } else {
      if (!price) {
        document.querySelector('.price-input').style =
          'outline: 2px solid #f4cd46;';
        toast.warn('Unesite cijenu', toastSetup('top-right', 3000));
        return;
      }
      const totalSeats = parseInt(
        selectedZoneData[1].rows[zoneKey].total_seats
      ); // Parse total_seats as an integer

      // Create an array of seat numbers based on the total_seats value
      seatNumbersArray = Array.from({ length: totalSeats }, (_, i) => i + 1);
      document.querySelector('.highlighted').classList.add('done');
    }

    // Update the rows state to include the new seats array
    setRows((prevRows) => ({
      ...prevRows,
      [zoneKey]: {
        ...prevRows[zoneKey],
        price: Number(price),
        name: type,
        rows: {
          ...prevRows[zoneKey].rows,
          [zoneKey]: {
            ...prevRows[zoneKey].rows[zoneKey],
            seats: seatNumbersArray,
          },
        },
      },
    }));

    document.querySelector('.highlighted').classList.remove('highlighted');
    setModalWindow(false);
  }

  const handleCheckboxChange = (zoneKey) => {
    const updatedSelectedZone = [...selectedZone];

    if (updatedSelectedZone.includes(zoneKey)) {
      // If the zoneKey is already in the selectedZone array, remove it
      const index = updatedSelectedZone.indexOf(zoneKey);
      if (index !== -1) {
        updatedSelectedZone.splice(index, 1);
      }
    } else {
      // If the zoneKey is not in the selectedZone array, add it
      updatedSelectedZone.push(zoneKey);
    }

    setSelectedZone(updatedSelectedZone);
  };

  function saveRows(e) {
    e.preventDefault();
    const rowsPrice = document.querySelector('.rows-price').value;
    const rowsCategory = document.querySelector('.rows-category').value;

    if (rowsPrice === '' || rowsCategory === '' || !selectedZone[0]) {
      toast.warn(
        'Unesite cijenu, kategoriju i odaberite bar jednu zonu.',
        toastSetup('top-right', 3000)
      );
      return;
    }

    // Update the rows state for each selected zone
    selectedZone.forEach((zoneKey) => {
      document.getElementById(`${zoneKey}`).classList.add('done');
      setRows((prevRows) => ({
        ...prevRows,
        [zoneKey]: {
          ...prevRows[zoneKey],
          price: Number(rowsPrice),
          name: rowsCategory,
          rows: {
            ...prevRows[zoneKey].rows,
            [zoneKey]: {
              ...prevRows[zoneKey].rows[zoneKey],
              seats: Array.from(
                { length: Number(prevRows[zoneKey].rows[zoneKey].total_seats) },
                (_, index) => index + 1
              ),
            },
          },
        },
      }));
    });
    toast.success(
      'Uspješno ste dodali cijenu i kategoriju za odabrane zone.',
      toastSetup('top-right', 3000)
    );
  }
  return (
    groundPlanImg && (
      <>
        {modalWindow ? (
          <>
            <div className="modal">
              <p className="disable-zone">
                Izbaci ovu zonu iz prodaje{' '}
                <input className="disable-zone-checkbox" type="checkbox" />
              </p>
              <h6>Odaberite cijenu sjedala za ovu zonu</h6>
              <input
                value={price}
                className="price-input"
                type="number"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
              <h6>Tip ulaznice</h6>
              <input
                value={type}
                className="price-input"
                type="text"
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />
              <button
                onClick={(e) => {
                  saveZone(e);
                }}
              >
                Spremi
              </button>
            </div>
            <div
              onClick={() => {
                setModalWindow(false);
              }}
              className="blur"
            ></div>
          </>
        ) : (
          ''
        )}
        <div className="organize-event-plan-wrapper">
          <div
            id="tooltip"
            display="none"
            style={{ position: 'absolute', display: 'none' }}
          ></div>
          <ImageMapper
            mode={Mode.SELECT}
            cb={(editor) => {
              editor.loadImage(groundPlanImg.src); // Load the URL directly
              editor.polygon();
            }}
            options={{
              width: groundPlanImg.width,
              height: groundPlanImg.height,
            }}
            handleZoneClick={handleZoneClick}
            preDrawnShapes={rows}
          />
          <div className="select-all-seats-wrapper">
            <h6>Odredi cijenu i kategoriju za više redova</h6>

            <div className="organize-zones-wrapper">
              {Object.entries(placeData.zones).map(([zoneKey, value], i) => {
                const isChecked = selectedZone.includes(zoneKey);

                return (
                  <div className="selling-row" key={i}>
                    <p>Zona {zoneKey}</p>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(zoneKey)}
                    />
                  </div>
                );
              })}
            </div>
            <div className="zones-input-wrapper">
              <input
                className="rows-price"
                type="number"
                placeholder="Cijena"
              />
              <input
                className="rows-category"
                type="text"
                placeholder="Kategorija"
              />
              <button
                onClick={(e) => {
                  saveRows(e);
                }}
              >
                Spremi
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};
