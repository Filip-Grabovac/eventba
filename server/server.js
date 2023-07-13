require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const users = require("./routes/users");
const concerts = require("./routes/concerts");
const payment = require("./routes/payments");
const entrance_controller = require("./routes/entrances");
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", users);
app.use("/api/v1/concerts", concerts);
app.use("/api/v1/payment", payment);
app.use("/api/v1/entrance_controllers", entrance_controller);

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
