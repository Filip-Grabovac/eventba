const cron = require("node-cron");
const concertHistory = require("./controllers/concertHistory");

// Schedule the task to run every minute
cron.schedule("* * * * *", () => {
  console.log("CronJob every minute!");
  concertHistory();
});
