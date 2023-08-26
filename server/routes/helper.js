const express = require("express");
const router = express.Router();

const {
  getSponsorList,
  updateSponsorList,
  getHotEvents,
} = require("../controllers/helper");

router.route("/sponsors").get(getSponsorList).post(updateSponsorList);
router.route("/hot_events").get(getHotEvents);

module.exports = router;
