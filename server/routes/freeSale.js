const express = require("express");
const router = express.Router();

const {
  getTickets,
  downloadTickets,
  loanTickets,
  addTransaction,
  verifyTransaction,
} = require("../controllers/freeSale.js");

// Route
router.route("/generate-tickets").post(getTickets);
router.route("/download-tickets").get(downloadTickets);
router.route("/loan-tickets").post(loanTickets);
router.route("/add-transaction").post(addTransaction);
router.route("/verify-transaction").post(verifyTransaction);

module.exports = router;
