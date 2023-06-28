require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const users = require("./routes/users");
const concerts = require("./routes/concerts");
const payment = require("./controllers/payment");
const cors = require("cors");

// const nodemailer = require("nodemailer");

// let mailTransporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "testtemail029@gmail.com",
//     pass: "qsgcubyndecgnrbz",
//   },
// });

// let details = {
//   from: "testtemail029@gmail.com",
//   to: "13kreso@gmail.com",
//   subject: "test, test",
//   text: "testing out",
// };

// mailTransporter.sendMail(details, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Email sent");
//   }
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", users);
app.use("/api/v1/concerts", concerts);
app.post("/payment", payment.getPaymentInfo);

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
