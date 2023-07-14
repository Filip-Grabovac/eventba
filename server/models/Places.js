const mongoose = require("mongoose");
const connectDB = require("../db/connect");
const eventba = connectDB(process.env.DATABASE_URL);

const PlaceSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  zones: { type: Array },
});

module.exports = eventba.model("Place", PlaceSchema, "places");
