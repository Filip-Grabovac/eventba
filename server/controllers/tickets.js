const connectDB = require("../db/connect");
const TicketSchema = require("../models/Ticket");

const checkTicket = async (req, res) => {
  const { collection_name, id } = req.params;

  const Ticket = await connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    collection_name
  );

  try {
    const thatTicket = await Ticket.findOneAndUpdate(
      { _id: id, isValid: true }, // Only update if the ticket is valid
      { $set: { isValid: false } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!thatTicket) {
      // If the ticket is not found or already used (isValid=false), respond with an error message
      return res
        .status(404)
        .json({ msg: "Neuspješno", msgInfo: "Ulaznica je već iskorištena!" });
    }

    // If the ticket was successfully updated to false, respond with a success message
    res.status(200).json({ msg: "Uspješno" }); //Ulaznica je ispravna! Hvala na posjeti!.
  } catch (error) {
    // Handle any other errors that might occur during the process
    res
      .status(500)
      .json({ msg: "Neuspješno", msgInfo: "Nepostojeća ulaznica!" });
  }
};

module.exports = checkTicket;
