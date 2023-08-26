const {
  calculateHotEvents,
} = require("../functions/concert/calculateHotEvents");
const processConcerts = require("./controllers/concertHistory");

module.exports = () => {
  console.log("Running concertHistory function...");
  processConcerts();
  calculateHotEvents(); // Call the function
};
