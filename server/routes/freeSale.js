const express = require("express");
const router = express.Router();

const { getTickets, downloadTickets } = require("../controllers/freeSale.js");

// Route
router.route("/generate-tickets").post(getTickets);
router.route("/download-tickets").get(downloadTickets);

module.exports = router;
