const express = require("express");
const router = express.Router();
const uploadImage = require("../controllers/uploadFile");
const {
  findConcert,
  getAllConcerts,
  createEvent,
  searchEventByType,
} = require("../controllers/concerts");

router.route("/this_week").get(findConcert);
router.route("/create_event").post(createEvent);
router.route("/upload_img").post(uploadImage);
router.route("/:type/:value").get(findConcert);
router.route("/search/:type/:search_value").get(searchEventByType);
router.route("/").get(getAllConcerts);

module.exports = router;
