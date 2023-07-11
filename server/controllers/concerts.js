const Concert = require("../models/Concert");
const path = require("path");

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
    await Concert.create(req.body);

    res.status(201).json({ message: "Uspješno ste dodali događaj" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Došlo je do greške pri unosu " });
  }
};

module.exports = {
  getAllConcerts,
  findConcert,
  createEvent,
};
