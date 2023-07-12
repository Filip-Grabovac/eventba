const express = require("express");
const router = express.Router();

const {
  findConcert,
  getAllConcerts,
  createEvent,
} = require("../controllers/concerts");

router.route("/this_week").get(findConcert);
router.route("/:type/:value").get(findConcert);
router.route("/").get(getAllConcerts);
router.route("/create_event").post(createEvent);
module.exports = router;
// Routes
