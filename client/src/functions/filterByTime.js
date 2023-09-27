function filterByTime(data) {
  // Copy the array to avoid changes to the original array
  const copyOfData = [...data];

  // Get the current date
  const currentDate = new Date();

  // Use the filter() function to get documents where time_of_event has not passed current date
  const filteredData = copyOfData.filter((document) => {
    // Convert event times into Date objects for comparison
    const eventTime = new Date(document.time_of_event);

    // Check if event time has not passed current date
    return eventTime >= currentDate;
  });

  // Return the filtered array
  return filteredData;
}

export default filterByTime;
