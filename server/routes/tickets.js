const express = require("express");
const router = express.Router();
const ticketCheck = require("../controllers/tickets");

router.route("/:collection_name/:id").patch(ticketCheck);

module.exports = router;
