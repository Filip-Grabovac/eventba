const Concert = require("../models/Concert");
const Ticket = require("../models/Ticket");

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find({});
    res.status(200).json({ concerts });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const findConcert = async (req, res) => {
  try {
    const { type, value } = req.params;
    let query;
    if (type === "is_promoted_event") {
      query = { is_promoted_event: value === "true" };
    } else if (type === "id") {
      query = { _id: value };
    } else if (type === "this_week") {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      query = { time_of_event: { $gte: today, $lt: nextWeek } };
    } else if (type === "type") {
      query = { type: { $in: [value] } };
    } else if (type === "search") {
      query = { performer_name: { $regex: value, $options: "i" } };
    } else {
      return res.status(400).json({ error: "Pogrešna pretraga" });
    }

    const concert = await Concert.find(query);

    if (
      type === "id" ||
      type === "this_week" ||
      type === "type" ||
      type === "search"
    ) {
      // Return the whole concert object when searching by ID
      return res.status(200).json(concert);
    }

    const filteredConcerts = concert.map(({ _id, poster }) => ({
      _id,
      poster,
    }));
    res.status(200).json(filteredConcerts);
  } catch (error) {
    res.status(500).json({
      error: "Došlo je do greške na serveru, molimo pokušajte kasnije",
    });
  }
};

const createEvent = async (req, res) => {
  try {
    // Create new event
    const event = await Concert.create(req.body);

    console.log(event);
    let tickets = [];

    if (event.place.type === "stadium") {
      // Generate tickets for each seat in the stadium
      const seats = ["A1", "A2", "B1", "B2"]; // Replace with actual seat data

      seats.forEach((seat) => {
        const ticket = new Ticket({
          concert: event._id,
          seatNumber: seat,
          // additional ticket details
        });

        tickets.push(ticket);
      });
    } else if (event.place.type === "theater") {
      // Generate tickets for the theater (e.g., one ticket for the entire event)
      const ticket = new Ticket({
        concert: event._id,
        // additional ticket details
      });

      tickets.push(ticket);
    } else if (event.place.type === "hall") {
      // Generate tickets for the hall (e.g., normal and vip ticket types)

      // Create normal ticket(s) with price and amount
      for (let i = 0; i < event.tickets.type.normal.amount; i++) {
        const normalTicket = new Ticket({
          concert: event._id,
          type: {
            normal: {
              price: event.tickets.type.normal.price,
              amount: 1, // Set the amount for each normal ticket to 1
            },
          },
          // additional ticket details for normal ticket
        });
        tickets.push(normalTicket);
      }

      // Create vip ticket(s) with price and amount
      for (let i = 0; i < event.tickets.type.vip.amount; i++) {
        const vipTicket = new Ticket({
          concert: event._id,
          type: {
            vip: {
              price: event.tickets.type.vip.price,
              amount: 1, // Set the amount for each vip ticket to 1
            },
          },
          // additional ticket details for vip ticket
        });
        tickets.push(vipTicket);
      }
    }

    // Save the ticket documents
    const createdTickets = await Ticket.insertMany(tickets);

    // Update the event with the ticket references
    event.tickets = createdTickets.map((ticket) => ticket._id);
    await event.save();

    res
      .status(201)
      .json({ message: "Successfully added the event", eventData: event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while adding the event" });
  }
};

module.exports = {
  getAllConcerts,
  findConcert,
  createEvent,
};
