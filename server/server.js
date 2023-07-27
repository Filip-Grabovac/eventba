require("dotenv").config();
const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const connectDB = require("./db/connect");
const users = require("./routes/users");
const concerts = require("./routes/concerts");
const payment = require("./routes/payments");
const entrance_controller = require("./routes/entrances");
const places = require("./routes/places");
const tickets = require("./routes/tickets");
const cors = require("cors");
const fileUpload = require("express-fileupload");
// const cronJob = require("./cronjob/dailyOperations");

app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("ticket-gen/public"));
app.use("/api/v1/users", users);
app.use("/api/v1/concerts", concerts);
app.use("/api/v1/payment", payment);
app.use("/api/v1/entrance_controllers", entrance_controller);
app.use("/api/v1/places", places);
app.use("/api/v1/tickets", tickets);

const start = async () => {
  try {
    // const httpsOptions = {
    //   key: fs.readFileSync("/etc/letsencrypt/live/event.ba/privkey.pem"),
    //   cert: fs.readFileSync("/etc/letsencrypt/live/event.ba/fullchain.pem"),
    // };
    // const server = https.createServer(httpsOptions, app);
    app.listen(5000, console.log("Server is listening on port 5000 (HTTPS)"));
  } catch (error) {
    console.error(error);
  }
};
// cronJob;

start();
