const Ticket = require("../models/Ticket");

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
module.exports = {
  getAllTickets,
};
