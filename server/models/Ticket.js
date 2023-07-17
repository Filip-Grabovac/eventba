const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  concert: { type: mongoose.Schema.Types.ObjectId, ref: "Concert" },
  performer_name: { type: String },
  category: { type: String },
  price: { type: Number },
  ticketName: { type: String },
  owner: { type: String },
  sentOnEmail: { type: String },
  seatNumber: { type: String },
  isValid: { type: Boolean },

  // additional ticket fields
});

module.exports = TicketSchema;
