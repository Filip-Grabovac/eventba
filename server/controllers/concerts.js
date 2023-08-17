const concertSchema = require('../models/Concert');
const connectDB = require('../db/connect');
const { updateConcertFunc } = require('../functions/concert/updateConcertFunc');
const {
  calculateHotEvents,
} = require('../functions/concert/calculateHotEvents');

const Concert = connectDB(process.env.DATABASE_URL).model(
  'Concert',
  concertSchema,
  'concerts'
);
const getAllConcerts = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const concerts = await Concert.find({ time_of_event: { $gt: currentDate } })
      .select('_id time_of_event performer_name place')
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
    if (type === 'is_promoted_event') {
      query = { is_promoted_event: value === 'true' };
    } else if (type === 'id') {
      query = { _id: value };
    } else if (type === 'this_week') {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      query = { time_of_event: { $gte: today, $lt: nextWeek } };
    } else if (type === 'type') {
      query = { type: { $in: [value] } };
    } else if (type === 'search') {
      query = { performer_name: { $regex: value, $options: 'i' } };
    } else {
      return res.status(400).json({ error: 'Pogrešna pretraga' });
    }

    const concerts = await Concert.find(query);

    const today = new Date();
    const filteredConcerts = concerts.filter(
      (concert) => concert.time_of_event >= today
    );

    if (
      type === 'id' ||
      type === 'this_week' ||
      type === 'type' ||
      type === 'search'
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
      error: 'Došlo je do greške na serveru, molimo pokušajte kasnije',
    });
  }
};

const createEvent = async (req, res) => {
  try {
    // Create new event
    await Concert.create(req.body);
    res.status(201).json({ message: 'Uspješno dodan događaj' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Greška pri dodavanju događaja' });
  }
};

const searchEventByType = async (req, res) => {
  const { type, search_value } = req.params;
  let query;

  if (search_value) {
    const today = new Date();
    query = {
      $or: [
        { performer_name: { $regex: search_value, $options: 'i' } },
        { 'place.country': { $regex: search_value, $options: 'i' } },
        { 'place.city': { $regex: search_value, $options: 'i' } },
        { 'place.place': { $regex: search_value, $options: 'i' } },
        { description: { $regex: search_value, $options: 'i' } },
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
    res.status(500).json({ message: 'Greška pri pretraži događaja.' });
  }
};

const getEventsByOrganizerId = async (req, res) => {
  const { organizerId } = req.params;

  try {
    const events = await Concert.find({ organizer: organizerId }).select({
      performer_name: 1,
      _id: 1,
      time_of_event: 1,
      place: 1,
    });

    res.status(200).json(events);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Greška u dostavljanju podataka za organizatora.' });
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
      return res.status(404).json({ message: 'Događaj nije pronađen.' });
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

    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Greška u dostavljanju podataka za organizatora.' });
  }
};

const updateConcertProperty = async (req, res) => {
  const { id, type, value } = req.params;
  let message;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: 'Niste proslijedili id koncerta.' });
    }

    const concert = await Concert.findById(id);

    if (!concert) {
      return res.status(404).json({ message: 'Koncert nije pronađen.' });
    }

    if (type === 'suggested') {
      if (value === 'true') {
        // Add 'suggested' to the 'type' array
        concert.type.push('suggested');
        message = 'Uspješno ste preporučili događaj.';
      } else {
        // Remove 'suggested' from the 'type' array
        concert.type = concert.type.filter((item) => item !== 'suggested');
        message = 'Uspješno ste uklonili preporuku.';
      }
    } else if (type === 'promoted') {
      // Update the 'is_promoted_event' property
      concert.is_promoted_event = value === 'true';

      if (value === 'true') message = 'Uspješno ste promovirali događaj.';
      else message = 'Uspješno ste uklonili promociju događaja.';
    } else {
      // If an invalid type is provided in the URL
      return res.status(400).json({ message: 'Nevažeći tip.' });
    }

    await concert.save();

    res.status(200).json({ message: message });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri ažuriranju događaja.' });
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
        .json({ message: 'concertIds should be an array.' });
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
      .json({ message: 'Greška pri pronalasku preprodavača i koncerta.' });
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
  searchEventByType,
  getEventsByOrganizerId,
  updateConcertProperty,
  resellersConcertInfo,
  updateConcert,
  calculateEvents,
  getEventsWithinDates,
};
