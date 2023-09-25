const express = require("express");
const {
  getTicketByPosition,
  checkTicket,
  toggleTicketValidity,
  getTicketByEmail,
} = require("../controllers/tickets");
const router = express.Router();

router.route("/:collection_name/:id").patch(checkTicket);
router.route("/:collection_name/:position").get(getTicketByPosition);
router.route("/:collection_name/:id").post(toggleTicketValidity);
router.route("/find_by_email/:collection_name/:email").get(getTicketByEmail);

module.exports = router;
