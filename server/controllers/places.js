const Place = require("../models/Places");

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({});
    res.status(200).json({ places });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getPlaceByLocation = async (req, res) => {
  try {
    const location = req.params.location;
    const places = await Place.find({ location });
    const placeNames = places.map((place) => place.name);
    res.status(200).json({ placeNames });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getCityName = async (req, res) => {
  const city_name = req.params.city_name;

  try {
    const regex = new RegExp(city_name, "i");
    const cities = await Place.find({ location: { $regex: regex } });

    if (cities.length === 0) {
      return res.status(404).json({ msg: "Taj grad se ne nalazi u bazi" });
    } else {
      const uniqueCities = Array.from(
        new Set(cities.map((city) => city.location))
      );
      res.status(200).json({ city: uniqueCities });
    }
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

const addPlace = async (req, res) => {
  const { name, location, type, zones } = req.body;

  try {
    const newPlace = new Place({ name, location, type, zones });
    await newPlace.save();

    res.status(201).json({ msg: "Dvorana je uspješno dodana" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllPlaces,
  getZones,
  addPlace,
  getCityName,
  getPlaceByLocation,
};
