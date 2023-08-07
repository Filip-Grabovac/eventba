const express = require("express");
const router = express.Router();

const {
  getTickets,
  downloadTickets,
  loanTickets,
} = require("../controllers/freeSale.js");

// Route
router.route("/generate-tickets").post(getTickets);
router.route("/download-tickets").get(downloadTickets);
router.route("/loan-tickets").post(loanTickets);

module.exports = router;
