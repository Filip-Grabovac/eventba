const {
  calculateHotEvents,
} = require("../functions/concert/calculateHotEvents");
const processConcerts = require("./controllers/concertHistory");
const performBackup = require("./controllers/dbBackup");

module.exports = () => {
  console.log("Running concertHistory function...");
  processConcerts();
  console.log("Calculating HotEvents");
  calculateHotEvents(); // Call the function
  console.log("Preforming db backup");
  performBackup();
};
