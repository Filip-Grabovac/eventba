function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function randomizeArrayWithUniquePerformers(array) {
  const uniquePerformers = new Set();

  // Create a deep copy of the original array
  const shuffledArray = JSON.parse(JSON.stringify(array));

  // Shuffle the array
  shuffleArray(shuffledArray);

  // Ensure no adjacent events have the same performer name
  for (let i = 1; i < shuffledArray.length; i++) {
    const currentEvent = shuffledArray[i];
    const previousEvent = shuffledArray[i - 1];

    if (currentEvent.performer_name === previousEvent.performer_name) {
      // If the performer is the same, find a different event to swap
      let j = i + 1;
      while (j < shuffledArray.length) {
        if (!uniquePerformers.has(shuffledArray[j].performer_name)) {
          [shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
          ];
          uniquePerformers.add(shuffledArray[j].performer_name);
          break;
        }
        j++;
      }
    } else {
      uniquePerformers.add(currentEvent.performer_name);
    }
  }

  return shuffledArray;
}

export default randomizeArrayWithUniquePerformers;
