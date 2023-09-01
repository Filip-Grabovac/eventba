const mongoose = require("mongoose");

const ConcertSchema = new mongoose.Schema({
  type: [String],
  sponsors: [String],
  performer_name: String,
  poster: {
    landscape: String,
    portrait: String,
  },
  tickets_yesterday: {
    online_sale: {
      total_amount: Number,
      sold_amount: Number,
      amount_inBAM: Number,

      zones: {},
    },
    free_sale: {
      total_amount: {
        type: Number,
        default: 0, // Set default value for total_amount
      },
      amount_inBAM: {
        type: Number,
        default: 0, // Set default value for amount_inBAM
      },
      total_loaned: {
        type: Number,
        default: 0, // Set default value for total_loaned
      },
      sold_amount: {
        type: Number,
        default: 0, // Set default value for sold_amount
      },

      amount_inBAM: {
        type: Number,
        default: 0, // Set default value for type
      },
      resellers: {
        type: [
          {
            reseller_id: {
              type: mongoose.Schema.Types.ObjectId, // Set the field type to ObjectId
              ref: "users",
            },
            reseller_name: String,
            reseller_address: String,
            transactions: {
              zones: [Object], // Change the type to an array of Objects
              default: [], // Set default value to an empty array
            },

            zones: Object,
          },
        ],
        default: [], // Set default value for resellers
      },
    },
  },
  tickets: {
    online_sale: {
      total_amount: Number,
      sold_amount: Number,
      amount_inBAM: Number,
      zones: Object,
    },
    free_sale: {
      total_amount: {
        type: Number,
        default: 0, // Set default value for total_amount
      },
      amount_inBAM: {
        type: Number,
        default: 0, // Set default value for amount_inBAM
      },
      total_loaned: {
        type: Number,
        default: 0, // Set default value for total_loaned
      },
      sold_amount: {
        type: Number,
        default: 0, // Set default value for sold_amount
      },
      zones: {
        type: Object,
        default: {}, // Set default value for type
      },
      amount_inBAM: {
        type: Number,
        default: 0, // Set default value for type
      },
      resellers: {
        type: [
          {
            reseller_id: {
              type: mongoose.Schema.Types.ObjectId, // Set the field type to ObjectId
              ref: "users",
            },
            reseller_name: String,
            reseller_address: String,
            transactions: {
              zones: [Object], // Change the type to an array of Objects
              default: [], // Set default value to an empty array
            },

            zones: Object,
          },
        ],
        default: [], // Set default value for resellers
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
});

module.exports = ConcertSchema;
