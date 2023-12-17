const {
  calculateHotEvents,
} = require("../functions/concert/calculateHotEvents");
const processConcerts = require("./controllers/concertHistory");
const performBackup = require("./controllers/dbBackup");
const sendDailyReport = require("./controllers/sendDailyReport");

module.exports = () => {
  console.log("Running concertHistory function...");
  processConcerts();
  console.log("Calculating HotEvents");
  calculateHotEvents(); // Call the function
  console.log("Preforming db backup");
  performBackup();
  console.log("Sending report of daily sales");
  sendDailyReport();
};
