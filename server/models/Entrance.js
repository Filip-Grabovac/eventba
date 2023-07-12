const mongoose = require("mongoose");

const EntranceShema = new mongoose.Schema({
  id: { type: Number },
  event: { type: String },
  entrance_num: { type: Number },
  name: { type: String },
  password: { type: String },
  organizer_id: { type: String },
});

module.exports = mongoose.model(
  "Entrance",
  EntranceShema,
  "entrance_controllers"
);
