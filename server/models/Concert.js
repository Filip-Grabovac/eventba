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
  _id: mongoose.Schema.Types.ObjectId,
  type: [String],
  sponsors: [String],
  performer_name: String,
  poster: {
    landscape: String,
    portrait: String,
  },
  tickets: {
    online_sale: {
      total_amount: Number,
      sold_amount: Number,
      amount_inBAM: Number,
      type: Object,
    },
    free_sale: [
      {
        reseller_name: String,
        type: Object,
      },
    ],
  },
  time_of_event: {
    type: Date,
  },
  place: {
    country: String,
    city: String,
    place: String,
    type: {
      type: String,
      default: "hall", // Set the default value to "hall"
    },
  },
  is_promoted_event: {
    type: Boolean,
    default: false,
  },
  description: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  concertHistory: [concertHistorySchema],
  previousSoldAmount: {
    type: Number,
    default: 0,
  },
});

module.exports = ConcertSchema;
