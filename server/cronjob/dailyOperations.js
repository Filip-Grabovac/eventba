const cron = require("node-cron");
const concertHistory = require("./controllers/concertHistory");

// Schedule the task to run every 1 minute
cron.schedule("*/1 * * * *", () => {
  console.log("CronJob everyminute!");
  concertHistory();
});
