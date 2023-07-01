require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const users = require("./routes/users");
const concerts = require("./routes/concerts");
const payment = require("./routes/payments");
const cors = require("cors");
const sendMail = require("./mailer/mailer");

// sendMail("grabovacfilipp@gmail.com", "Naslov", "Hello, this is a test email.");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", users);
app.use("/api/v1/concerts", concerts);
app.use("/api/v1/payment", payment);

const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL);
    app.listen(port, console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

const port = 5000;

start();
