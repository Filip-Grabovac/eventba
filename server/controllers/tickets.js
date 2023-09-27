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
        .status(400)
        .json({ msg: "Neuspješno", msgInfo: "Ulaznica je već iskorištena!" });
    }

    // If the ticket was successfully updated to false, respond with a success message
    res.status(200).json({ msg: "Uspješno" }); //Ulaznica je ispravna! Hvala na posjeti!.
  } catch (error) {
    console.log(error);
    // Handle any other errors that might occur during the process
    res
      .status(200)
      .json({ msg: "Neuspješno", msgInfo: "Nepostojeća ulaznica!" });
  }
};

const getTicketByPosition = async (req, res) => {
  const { collection_name, position } = req.params;

  const Ticket = await connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    collection_name
  );

  try {
    const ticket = await Ticket.find()
      .sort({ _id: 1 })
      .skip(parseInt(position) - 1)
      .limit(1);

    if (!ticket || ticket.length === 0) {
      return res.status(404).json({
        msg: "Ulaznica nepostoji!",
        msgInfo: "Nema ulaznice pod tim rednim brojem.",
      });
    }

    res.status(200).json({ msg: "Uspješno", ticket: ticket[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Greška", msgInfo: "Greška na serveru" });
  }
};
const getTicketByEmail = async (req, res) => {
  const { collection_name, email } = req.params;

  const Ticket = await connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    collection_name
  );

  try {
    // Use a regex to perform a partial match on email addresses
    const tickets = await Ticket.find({
      sent_on_email: { $regex: email, $options: "i" },
    });

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        msg: "Ulaznica nije pronađena!",
        msgInfo:
          "Nema ulaznica povezanih s navedenim emailom ili dijelom emaila.",
      });
    }

    res.status(200).json({ msg: "Uspješno", tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Greška", msgInfo: "Greška na serveru" });
  }
};

const toggleTicketValidity = async (req, res) => {
  const { collection_name, id } = req.params;

  const Ticket = await connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    collection_name
  );

  try {
    const existingTicket = await Ticket.findById(id);

    if (!existingTicket) {
      return res.status(404).json({
        msg: "Ulaznica nije pronađena",
        msgInfo: "Nema ulaznice s navedenim ID-om.",
      });
    }

    // Toggle the isValid field
    existingTicket.isValid = !existingTicket.isValid;

    const updatedTicket = await existingTicket.save();

    res.status(200).json({ msg: "Uspješno", updatedTicket });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Greška", msgInfo: "Interna pogreška poslužitelja" });
  }
};

module.exports = {
  getTicketByPosition,
  checkTicket,
  toggleTicketValidity,
  getTicketByEmail,
};
