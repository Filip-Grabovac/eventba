const mongoose = require("mongoose");

const concertHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  sold_amount: Number,
  amount_inBam: Number,
  sold_amount_today: Number,
  type: Object,
});

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
  concertHistory: [concertHistorySchema],
  previousSoldAmount: {
    type: Number,
    default: 0,
  },
});

module.exports = ConcertSchema;
