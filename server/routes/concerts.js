const express = require("express");
const router = express.Router();

const {
  findConcert,
  getAllConcerts,
  createConcert,
} = require("../controllers/concerts");

router.route("/this_week").get(findConcert);
router.route("/:type/:value").get(findConcert);
router.route("/").get(getAllConcerts).post(createConcert);

module.exports = router;
// Routes
