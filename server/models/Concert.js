const mongoose = require("mongoose");

const ticketInfo = {
  total_amount_left: {
    type: Number,
    default: 0,
  },
  sold_amount: {
    type: Number,
    default: 0,
  },
  amount_inBAM: {
    type: Number,
    default: 0,
  },
  zones: Object, // You can specify the type of 'zones' as needed
};

const resellerInfo = {
  reseller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  reseller_name: String,
  reseller_address: String,
  transactions: {
    zones: [Object],
    default: [],
  },
  zones: Object, // You can specify the type of 'zones' as needed
};

const ConcertSchema = new mongoose.Schema({
  type: [String],
  sponsors: [String],
  performer_name: String,
  poster: {
    landscape: String,
    portrait: String,
  },
  tickets_yesterday: {
    online_sale: { ...ticketInfo },
    free_sale: {
      ...ticketInfo,
      total_loaned: Number,
      resellers: {
        type: [resellerInfo],
        default: [],
      },
    },
  },
  tickets: {
    online_sale: { ...ticketInfo },
    free_sale: {
      ...ticketInfo,
      total_loaned: Number,
      resellers: {
        type: [resellerInfo],
        default: [],
      },
    },
  },
  time_of_event: {
    type: Date,
  },
  place: {
    country: String,
    city: String,
    place: String,
    ground_plan: String,
    type: {
      type: String,
      default: "hall",
    },
  },
  is_promoted_event: {
    type: Boolean,
    default: false,
  },
  description: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  verified: { type: Boolean, default: false },
  concert_history: [
    {
      _id: false,
      date: {
        type: Date,
        required: true,
      },
      tickets: {},
    },
  ],
  print_history: [
    {
      _id: false,
      date: {
        type: Date,
        required: true,
      },
      user: String,
      tickets: [],
    },
  ],
});

module.exports = ConcertSchema;
