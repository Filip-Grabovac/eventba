const Concert = require("../models/Concert");

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find({});
    res.status(200).json({ concerts });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createConcert = async (req, res) => {
  try {
    // Create a new user if no existing user found
    const concert = await Concert.create(req.body);
    res.status(201).json({ concert });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Došlo je do greške pri unosu " });
  }
};

const findConcert = async (req, res) => {
  try {
    const { type, value } = req.params;
    let query;
    console.log(type);
    if (type === "is_promoted_event") {
      query = { is_promoted_event: value === "true" };
    } else if (type === "id") {
      query = { _id: value };
    } else if (type === "this_week") {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      query = { time_of_event: { $gte: today, $lt: nextWeek } };
    } else {
      return res.status(400).json({ error: "Pogrešna pretraga" });
    }

    const concert = await Concert.find(query);

    if (type === "id" || type === "this_week") {
      // Return the whole concert object when searching by ID
      return res.status(200).json(concert);
    }

    // Only return the ID and poster when searching by email
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

module.exports = {
  getAllConcerts,
  findConcert,
  createConcert,
};
