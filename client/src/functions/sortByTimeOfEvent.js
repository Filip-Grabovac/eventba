function sortByTime(data) {
  // Kopirajte niz kako biste izbjegli promjene na originalnom nizu
  const copyOfData = [...data];

  // Upotrijebite funkciju sort() za sortiranje po vremenu događaja
  copyOfData.sort((a, b) => {
    // Pretvorite vremena događaja u Date objekte za usporedbu
    const timeA = new Date(a.time_of_event);
    const timeB = new Date(b.time_of_event);

    // Usporedite vremena događaja
    if (timeA < timeB) {
      return -1;
    }
    if (timeA > timeB) {
      return 1;
    }
    return 0;
  });

  // Vratite sortirani niz
  return copyOfData;
}

export default sortByTime;
