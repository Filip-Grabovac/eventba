const concertSchema = require("../models/Concert");
const connectDB = require("../db/connect");
const { updateConcertFunc } = require("../functions/concert/updateConcertFunc");
const {
  calculateHotEvents,
} = require("../functions/concert/calculateHotEvents");
const generatePdf = require("../functions/concert/concert-history/generatePdf");
const { updateSponsorList } = require("./helper");
const User = require("../models/User");

const Concert = connectDB(process.env.DATABASE_URL).model(
  "Concert",
  concertSchema,
  "concerts"
);

const getAllConcerts = async (req, res) => {
  try {
    const currentDate = new Date();
    const concerts = await Concert.find({
      time_of_event: { $gt: currentDate },
      verified: true, // Filter for verified concerts
    })
      .select("_id time_of_event performer_name place")
      .exec();

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
      query = { is_promoted_event: value === "true", verified: true };
    } else if (type === "id") {
      query = { _id: value, verified: true };
    } else if (type === "this_week") {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      query = {
        time_of_event: { $gte: today, $lt: nextWeek },
        verified: true, // Filter for verified concerts
      };
    } else if (type === "type") {
      query = { type: { $in: [value] }, verified: true };
    } else if (type === "search") {
      query = {
        performer_name: { $regex: value, $options: "i" },
        verified: true,
      };
    } else {
      return res.status(400).json({ error: "Pogrešna pretraga" });
    }

    const concerts = await Concert.find(query);

    if (type === "id") {
      return res.status(200).json(concerts);
    }

    const today = new Date();
    const filteredConcerts = concerts.filter(
      (concert) => concert.time_of_event >= today
    );

    if (
      type === "id" ||
      type === "this_week" ||
      type === "type" ||
      type === "search"
    ) {
      // Return the whole concert object when searching by ID
      return res.status(200).json(filteredConcerts);
    }

    const filteredConcertsForResponse = filteredConcerts.map(
      ({ _id, poster }) => ({
        _id,
        poster,
      })
    );
    res.status(200).json(filteredConcertsForResponse);
  } catch (error) {
    res.status(500).json({
      error: "Došlo je do greške na serveru, molimo pokušajte kasnije",
    });
  }
};
const createEvent = async (req, res) => {
  try {
    // Create new event
    await Concert.create(req.body);

    updateSponsorList(req.body.sponsors);
    res.status(201).json({ message: "Uspješno dodan događaj" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Greška pri dodavanju događaja" });
  }
};

const deleteEvent = async (req, res) => {
  const concertId = req.params.id;

  try {
    // Find the concert by _id and delete it
    const deletedConcert = await Concert.findByIdAndDelete(concertId);

    if (!deletedConcert) {
      return res.status(404).json({ message: "Koncert nije pronađen" });
    }

    res.status(200).json({ message: "Koncert uspješno obrisan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Greška prilikom brisanja koncerta" });
  }
};

const findUnverifiedEvents = async (req, res) => {
  try {
    const unverifiedConcerts = await Concert.find({ verified: false });
    res.status(200).json(unverifiedConcerts);
  } catch (error) {
    res.status(500).json({
      error:
        "Došlo je do pogreške prilikom dohvaćanja neprovjerenih koncerata.",
    });
  }
};

const verifyEvent = async (req, res) => {
  const concertId = req.body._id;
  try {
    const updatedConcert = await Concert.findByIdAndUpdate(
      concertId,
      { verified: true },
      { new: true }
    );

    if (!updatedConcert) {
      return res.status(404).json({ error: "Koncert nije pronađen." });
    }

    res.status(200).json(updatedConcert);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Došlo je do pogreške prilikom provjere koncerta." });
  }
};

const searchEventByType = async (req, res) => {
  const { type, search_value } = req.params;
  let query;

  if (search_value) {
    const today = new Date();
    query = {
      $or: [
        { performer_name: { $regex: search_value, $options: "i" } },
        { "place.country": { $regex: search_value, $options: "i" } },
        { "place.city": { $regex: search_value, $options: "i" } },
        { "place.place": { $regex: search_value, $options: "i" } },
        { description: { $regex: search_value, $options: "i" } },
      ],
      $and: [{ type: type }, { time_of_event: { $gte: today } }],
    };
  } else {
    const today = new Date();
    query = { type: type, time_of_event: { $gte: today } };
  }

  try {
    const concerts = await Concert.find(query);
    res.status(200).json(concerts);
  } catch (err) {
    res.status(500).json({ message: "Greška pri pretraži događaja." });
  }
};

const getEventsByOrganizerId = async (req, res) => {
  const { organizerId } = req.params;

  try {
    const user = await User.findById(organizerId);

    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen" });
    }

    let events;

    if (user.role === "admin") {
      // If user is an admin, get all concerts
      events = await Concert.find().select({
        performer_name: 1,
        _id: 1,
        time_of_event: 1,
        place: 1,
      });
    } else {
      // If user is not an admin, get concerts for the specific organizer
      events = await Concert.find({ organizer: organizerId }).select({
        performer_name: 1,
        _id: 1,
        time_of_event: 1,
        place: 1,
      });
    }

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Greškra pri dobahvatanju podataka." });
  }
};

const getEventsWithinDates = async (req, res) => {
  const { organizerId, concertId, startDate, endDate } = req.body;

  try {
    const concert = await Concert.findOne({
      organizer: organizerId,
      _id: concertId,
    });

    if (!concert) {
      return res.status(404).json({ message: "Event not found." });
    }

    const filteredEvents = concert.concert_history.filter((event) => {
      const eventTimestamp = new Date(event.date).getTime();
      const startTimestamp = new Date(startDate).getTime();
      const endTimestamp = new Date(endDate).getTime() + 24 * 60 * 60 * 1000;

      return eventTimestamp >= startTimestamp && eventTimestamp <= endTimestamp;
    });

    if (filteredEvents.length === 0) {
      return res.status(200).json({ concert: null, concert_history: [] });
    }

    const result = {
      concert: {
        performer_name: concert.performer_name,
        time_of_event: concert.time_of_event,
        place: concert.place,
      },
      concert_history: filteredEvents,
    };

    // Generate the PDF buffer using Puppeteer
    const pdfBuffer = await generatePdf(result);

    // Set content disposition to trigger download
    const pdfFileName = `povijest_prodaje_ulaznica.pdf`;
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pdfFileName}"`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send the PDF buffer as a response
    res.status(200).send(pdfBuffer);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error delivering data for the organizer." });
  }
};

const updateConcertProperty = async (req, res) => {
  const { id, type, value } = req.params;
  let message;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "Niste proslijedili id koncerta." });
    }

    const concert = await Concert.findById(id);

    if (!concert) {
      return res.status(404).json({ message: "Koncert nije pronađen." });
    }

    if (type === "suggested") {
      if (value === "true") {
        // Add 'suggested' to the 'type' array
        concert.type.push("suggested");
        message = "Uspješno ste preporučili događaj.";
      } else {
        // Remove 'suggested' from the 'type' array
        concert.type = concert.type.filter((item) => item !== "suggested");
        message = "Uspješno ste uklonili preporuku.";
      }
    } else if (type === "promoted") {
      // Update the 'is_promoted_event' property
      concert.is_promoted_event = value === "true";

      if (value === "true") message = "Uspješno ste promovirali događaj.";
      else message = "Uspješno ste uklonili promociju događaja.";
    } else {
      // If an invalid type is provided in the URL
      return res.status(400).json({ message: "Nevažeći tip." });
    }

    await concert.save();

    res.status(200).json({ message: message });
  } catch (err) {
    res.status(500).json({ message: "Greška pri ažuriranju događaja." });
  }
};

const resellersConcertInfo = async (req, res) => {
  const { userId } = req.params;
  const { concertIds } = req.body;

  try {
    // Validate that concertIds is an array
    if (!Array.isArray(concertIds)) {
      return res
        .status(400)
        .json({ message: "concertIds should be an array." });
    }

    // Find all concerts with "_id" property matching the ids from the array
    const concerts = await Concert.find({ _id: { $in: concertIds } });

    // Format the data as requested
    const formattedConcerts = concerts.map((concert) => {
      const { poster, tickets, performer_name, time_of_event, place } = concert;
      const freeSaleTickets = tickets.free_sale;
      const amountInBAM = tickets.free_sale.amount_inBAM;

      // Find the reseller with the matching id
      const reseller = freeSaleTickets.resellers.find(
        (reseller) => reseller.reseller_id == userId
      );

      return {
        poster,
        reseller,
        performer_name,
        time_of_event,
        place,
        amountInBAM,
      };
    });

    res.status(200).json({ resellersConcerts: formattedConcerts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Greška pri pronalasku preprodavača i koncerta." });
  }
};

const updateConcert = async (req, res) => {
  try {
    await updateConcertFunc(req, res, Concert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const calculateEvents = async (req, res) => {
  try {
    await calculateHotEvents(req, res, Concert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllConcerts,
  findConcert,
  createEvent,
  deleteEvent,
  searchEventByType,
  getEventsByOrganizerId,
  updateConcertProperty,
  resellersConcertInfo,
  updateConcert,
  calculateEvents,
  getEventsWithinDates,
  verifyEvent,
  findUnverifiedEvents,
};
