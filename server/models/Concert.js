const mongoose = require("mongoose");
const connectDB = require("../db/connect");

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
  sponsors: { type: Array },
});

module.exports = connectDB(
  "semongodb://eventba:AqpRhnhu7DA4M8nYDVLIqIDdtbFFewSkIdedmr8fzdkpEZqKje@185.99.2.232:27017/eventba?authSource=admin"
).model("Concert", ConcertSchema, "concerts");
