const concertSchema = require('../models/Concert');
const connectDB = require('../db/connect');
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

    const concert = await Concert.find(query);

    if (
      type === 'id' ||
      type === 'this_week' ||
      type === 'type' ||
      type === 'search'
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
      error: 'Došlo je do greške na serveru, molimo pokušajte kasnije',
    });
  }
};

const createEvent = async (req, res) => {
  try {
    // Create new event
    const event = await Concert.create(req.body);
    res
      .status(201)
      .json({ message: 'Uspješno dodan događaj', eventData: event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Greška pri dodavanju događaja' });
  }
};

const searchEventByType = async (req, res) => {
  const { type, search_value } = req.params;
  let query;

  if (search_value) {
    query = {
      $or: [
        { performer_name: { $regex: search_value, $options: 'i' } },
        { 'place.country': { $regex: search_value, $options: 'i' } },
        { 'place.city': { $regex: search_value, $options: 'i' } },
        { 'place.place': { $regex: search_value, $options: 'i' } },
        { description: { $regex: search_value, $options: 'i' } },
      ],
      $and: [{ type: type }],
    };
  } else {
    // Check for the type without any search_value filtering
    query = { type: type };
  }

  try {
    const concert = await Concert.find(query);
    res.status(200).json(concert);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri pretrazi događaja.' });
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
      .json({ message: 'Kreška pri pronalasku preprodavača i koncerta.' });
  }
};

const updateConcert = async (req, res) => {
  const { concertId } = req.params;
  const { total_amount, price, reseller_id, category_name } = req.body;
  let updatedTotalAmount,
    updatedSoldAmount,
    updatedAmountInBAM,
    updatedOverallCategory;

  try {
    // Find the concert with "_id" property matching the concertId
    const concert = await Concert.findById(concertId);

    if (!concert) {
      return res.status(404).json({ message: 'Koncert nije pronađen.' });
    }

    // Access the "free_sale" and "total_amount" properties in the tickets
    const { free_sale } = concert.tickets;

    const {
      total_amount: currentTotalAmount,
      sold_amount,
      amount_inBAM,
      resellers,
    } = free_sale;

    // Find the reseller in the "resellers" array with the matching "reseller_id"
    const targetReseller = resellers.find(
      (reseller) => reseller.reseller_id == reseller_id
    );
    const targetResellerIndex = resellers.findIndex(
      (reseller) => reseller.reseller_id == reseller_id
    );

    if (!targetReseller) {
      return res
        .status(400)
        .json({ message: 'Preprodavač sa ovim id nije pronađen.' });
    }

    // Find the category object with the matching "category_name" inside the "type" object
    const targetCategory = targetReseller.type[category_name];
    const targetOverallCategory = concert.tickets.free_sale.type[category_name];
    let soldAmount = targetCategory.sold;

    if (total_amount === '-') {
      updatedTotalAmount = currentTotalAmount - 1;
      updatedSoldAmount = sold_amount + 1;
      updatedAmountInBAM = amount_inBAM + price;
      soldAmount += 1;
      updatedOverallCategory = targetOverallCategory.amount - 1;
    } else if (total_amount === '+') {
      updatedTotalAmount = currentTotalAmount + 1;
      updatedSoldAmount = sold_amount - 1;
      updatedAmountInBAM = amount_inBAM - price;
      soldAmount -= 1;
      updatedOverallCategory = targetOverallCategory.amount + 1;
    } else {
      return res
        .status(400)
        .json({
          message: 'Pogrešna total_amount vrijednost. Koristi "+" or "-".',
        });
    }

    // Use updateOne to update the concert in the database
    await Concert.updateOne(
      { _id: concertId },
      {
        $set: {
          'tickets.free_sale.total_amount': updatedTotalAmount,
          'tickets.free_sale.sold_amount': updatedSoldAmount,
          'tickets.free_sale.amount_inBAM': updatedAmountInBAM,
          [`tickets.free_sale.resellers.${targetResellerIndex}.type.${category_name}.sold`]:
            soldAmount,
          [`tickets.free_sale.type.${category_name}.amount`]:
            updatedOverallCategory,
        },
      },
      { arrayFilters: [{ 'reseller.reseller_id': reseller_id }] }
    );

    res.status(200).json({
      message: 'Uspješno ažurirano.',
    });
  } catch (err) {
    console.error('Greška pri ažuriranju koncerta:', err);
    res.status(500).json({
      message: 'Serverska greška.',
    });
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
};
