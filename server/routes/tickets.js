const express = require("express");
const router = express.Router();

const { getAllTickets } = require("../controllers/tickets");

router.route("/").get(getAllTickets);

module.exports = router;
