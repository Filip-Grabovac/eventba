const express = require("express");
const router = express.Router();

const {
  getAllPlaces,
  getZones,
  addPlace,
  getCityName,
  getPlaceByLocation,
} = require("../controllers/places.js");

router.route("/").get(getAllPlaces);
router.route("/zones").get(getZones);
router.route("/add_place").post(addPlace);
router.route("/city_name/:city_name").get(getCityName);
router.route("/place_by_location/:location").get(getPlaceByLocation);

module.exports = router;
