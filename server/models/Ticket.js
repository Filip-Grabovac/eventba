const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  concert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "concerts",
  },
  performer_name: String,
  category: String,
  seat: String,
  row: String,
  price: Number,
  ticket_type: String,
  owner: String,
  sent_on_email: String,
  isValid: {
    type: Boolean,
    default: true,
  },
});

module.exports = TicketSchema;
