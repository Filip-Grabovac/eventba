const express = require("express");
const router = express.Router();

const { handlePaymentEndpoint } = require("../controllers/payment");

// Route
router.route("/:endpoint").post(handlePaymentEndpoint);

module.exports = router;
