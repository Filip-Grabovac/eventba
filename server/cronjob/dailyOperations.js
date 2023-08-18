const cron = require("node-cron");
const concertHistory = require("./controllers/concertHistory");

// Schedule the task to run every day after 03:00
cron.schedule("0 3 * * *", () => {
  console.log("CronJob every day after 03:00!");
  concertHistory();
});
