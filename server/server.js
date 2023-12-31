require("dotenv").config();
const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();

const users = require("./routes/users");
const login = require("./routes/login");
const concerts = require("./routes/concerts");
const payment = require("./routes/payments");
const entrance_controller = require("./routes/entrances");
const places = require("./routes/places");
const tickets = require("./routes/tickets");
const freeSale = require("./routes/freeSale");
const helper = require("./routes/helper");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cron = require("node-cron");
const cronJob = require("./cronjob/dailyOperations");
const sendDailyReport = require("./cronjob/controllers/sendDailyReport");

// Schedule the task to run every minute
cron.schedule("0 1 * * *", () => {
  console.log("CronJob at 1:00 AM CET every day!");
  cronJob(); // Call the cronJob function
});

cron.schedule("0 7 * * *", () => {
  console.log("CronJob Report of online sales");
  sendDailyReport();
});

app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("ticket-gen/public"));

app.use("/api/v1/users", users);
app.use("/api/v1/login", login);
app.use("/api/v1/concerts", concerts);
app.use("/api/v1/payment", payment);
app.use("/api/v1/entrance_controllers", entrance_controller);
app.use("/api/v1/places", places);
app.use("/api/v1/tickets", tickets);
app.use("/api/v1/freeSale", freeSale);
app.use("/api/v1/helper", helper);

const start = async () => {
  try {
    const isLocal = process.env.IS_LOCAL;
    if (isLocal === "true") {
      console.log("Is local");
      app.listen(5000, console.log("Server is listening on port 5000 (HTTPS)"));
    } else {
      console.log("Is NOT local");
      const httpsOptions = {
        key: fs.readFileSync("/etc/ssl/certificate/event.ba.key"),
        cert: fs.readFileSync("/etc/ssl/certificate/STAR_event_ba.crt"),
      };
      const server = https.createServer(httpsOptions, app);
      server.listen(
        5000,
        console.log("Server is listening on port 5000 (HTTPS)")
      );
    }
  } catch (error) {
    console.error(error);
  }
};

start();
