const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  concert: mongoose.Schema.Types.ObjectId,
  performer_name: String,
  category: String,
  seat: String,
  row: String,
  price: Number,
  ticketName: String,
  owner: String,
  sent_on_email: String,
  isValid: {
    type: Boolean,
    default: true,
  },
});

module.exports = TicketSchema;
