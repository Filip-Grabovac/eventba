const express = require("express");
const router = express.Router();

const { getAllPlaces, getZones } = require("../controllers/places.js");

router.route("/").get(getAllPlaces);
router.route("/zones").get(getZones);

module.exports = router;
