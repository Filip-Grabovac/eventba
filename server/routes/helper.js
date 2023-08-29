const express = require("express");
const router = express.Router();

const {
  getSponsorList,
  updateSponsorList,
  getHotEvents,
  manageNewsletterSubscription,
  resetPassword,
  requestPassword,
} = require("../controllers/helper");

router.route("/newsletter/:id").put(manageNewsletterSubscription);
router.route("/sponsors").get(getSponsorList).post(updateSponsorList);
router.route("/hot_events").get(getHotEvents);
router.route("/request_password").post(requestPassword);
router.route("/reset_password/:request_number").patch(resetPassword);

module.exports = router;
