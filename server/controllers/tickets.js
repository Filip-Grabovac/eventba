const connectDB = require("../db/connect");
const TicketSchema = require("../models/Ticket");

const checkTicket = async (req, res) => {
  const { collection_name, id } = req.params;
  const Ticket = await connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    collection_name
  );
  console.log(id);
  if (!id) {
    console.log("Greška pri skeniranju");
    return res
      .status(400)
      .json({ msg: "Nevažeći QR-code", msgInfo: "Skenirajte čitljiv QR-cod" });
  }
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

const getAllTicketsWithIDs = async (req, res) => {
  const { collection_name } = req.params;

  const Ticket = await connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    collection_name
  );

  try {
    const tickets = await Ticket.find().sort({ _id: 1 });

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        msg: "Nema ulaznica!",
        msgInfo: "Nema ulaznica u ovoj kolekciji.",
      });
    }

    // Dodaj ID: 1 za svaku ulaznicu
    const ticketsWithIDs = tickets.map((ticket, index) => {
      return { ...ticket._doc, ID: index + 1 };
    });

    res.status(200).json({ msg: "Uspješno", tickets: ticketsWithIDs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Greška", msgInfo: "Greška na serveru" });
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

const deleteTicketsByIds = async (req, res) => {
  const { collection_name } = req.params;
  const { ticketIds } = req.body;

  if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
    return res.status(400).json({
      msg: "Invalid request",
      msgInfo:
        "Please provide a valid array of ticket IDs in the request body.",
    });
  }

  const Ticket = await connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    collection_name
  );

  try {
    // Delete tickets based on the provided IDs
    const deletionResult = await Ticket.deleteMany({ _id: { $in: ticketIds } });

    if (deletionResult.deletedCount === 0) {
      return res.status(404).json({
        msg: "Tickets not found",
        msgInfo: "No tickets were found with the provided IDs.",
      });
    }

    res.status(200).json({
      msg: "Successfully deleted",
      msgInfo: `Successfully deleted ${deletionResult.deletedCount} ticket(s).`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error", msgInfo: "Server error" });
  }
};

// Helper function to delete tickets from db that are freesale
const deleteTicketsWithoutSentEmail = async () => {
  const Ticket = await connectDB(process.env.DATABASE_URL_TICKET).model(
    "Ticket",
    TicketSchema,
    "tickets_for_64f747b8e5b5631bf33972ad"
  );

  try {
    // Delete tickets without the "sent_on_email" property
    const result = await Ticket.deleteMany({
      sent_on_email: { $exists: false },
    });

    console.log(`${result.deletedCount} tickets removed successfully.`);
  } catch (error) {
    console.error("Error removing tickets:", error);
  }
};

module.exports = {
  getTicketByPosition,
  getAllTicketsWithIDs,
  checkTicket,
  toggleTicketValidity,
  getTicketByEmail,
  deleteTicketsByIds,
};
