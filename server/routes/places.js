const express = require("express");
const router = express.Router();

const { getAllPlaces, getZones } = require("../controllers/places");

router.route("/").get(getAllPlaces);
router.route("/zones").get(getZones);

module.exports = router;
