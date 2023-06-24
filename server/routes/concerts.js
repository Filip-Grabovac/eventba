const express = require("express");
const router = express.Router();

const {
  findConcert,
  getAllConcerts,
  createConcert,
} = require("../controllers/concerts");

router.route("/").get(getAllConcerts).post(createConcert);
router.route("/:type/:value").get(findConcert);

module.exports = router;
// Routes
