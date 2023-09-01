// HELPER FOR THEATERS

setZones((prevRows) => {
  const newZones = { ...prevRows };
  const rowToUpdate = newZones[zoneKey].rows[zoneKey];
  const seatIndex = rowToUpdate.seats.indexOf(seatNumber);

  if (seatIndex !== -1) {
    // Seat is currently reserved, remove it from the seats array and set it as free
    rowToUpdate.seats.splice(seatIndex, 1);
  } else {
    // Seat is currently free, add it to the seats array and set it as reserved
    rowToUpdate.seats.push(seatNumber);
  }

  return {
    ...prevRows,
    [zoneKey]: {
      ...prevRows[zoneKey],
      rows: {
        ...prevRows[zoneKey].rows,
        [zoneKey]: rowToUpdate,
      },
    },
  };
});
