const mongoose = require("mongoose");
const connectDB = require("../db/connect");
const eventba = connectDB(process.env.DATABASE_URL);

const ConcertSchema = new mongoose.Schema({
  id: { type: Number },
  performer_name: { type: String },
  poster: { type: Object },
  tickets: { type: Object },
  time_of_event: { type: Date },
  place: { type: Object },
  type: { type: Array },
  is_promoted_event: { type: Boolean },
  description: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = eventba.model("Concert", ConcertSchema, "concerts");
