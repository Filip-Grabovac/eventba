const mongoose = require("mongoose");

const ConcertSchema = new mongoose.Schema({
  id: { type: Number },
  performer_name: { type: String },
  poster: { type: Object },
  tickets: { type: Object },
  time_of_event: { type: String },
  place: { type: Object },
});

module.exports = mongoose.model("Concert", ConcertSchema, "concerts");
