require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const users = require("./routes/users");

app.use(express.json());
let database;

app.use("/api/v1/users", users);

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
