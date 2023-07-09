const express = require("express");
const router = express.Router();

const {
  handlePaymentEndpoint,
  handleTicketData,
} = require("../controllers/payment");

// Route
router.route("/get_payment_info").post(handlePaymentEndpoint);
router.route("/get_ticket_data").post(handleTicketData);

module.exports = router;
