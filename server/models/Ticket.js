const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  concert: { type: mongoose.Schema.Types.ObjectId, ref: "Concert" },
  type: {
    normal: {
      price: { type: Number },
      amount: { type: Number },
      // additional fields specific to the normal type
    },
    vip: {
      price: { type: Number },
      amount: { type: Number },
      // fields specific to the vip type
    },
  },
  seatNumber: { type: String }, // Optional field for seat number
  // additional ticket fields
});

module.exports = mongoose.model("Ticket", TicketSchema, "tickets");
