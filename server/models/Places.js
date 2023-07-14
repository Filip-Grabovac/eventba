const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  zones: { type: Array },
});

module.exports = mongoose.model("Place", PlaceSchema, "places");
