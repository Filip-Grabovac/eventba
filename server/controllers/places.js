const Place = require("../models/Places");

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({});
    res.status(200).json({ places });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getZones = async (req, res) => {
  const { selectedHall } = req.query; // Retrieve the selectedHall from the query parameters

  try {
    const place = await Place.findOne({ name: selectedHall });

    if (!place) {
      return res.status(404).json({ msg: "Concert hall not found" });
    }

    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = { getAllPlaces, getZones };
