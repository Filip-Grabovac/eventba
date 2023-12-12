const express = require("express");
const {
  getTicketByPosition,
  checkTicket,
  toggleTicketValidity,
  getTicketByEmail,
  getAllTicketsWithIDs,
  deleteTicketsByIds,
} = require("../controllers/tickets");

const { isAdminMiddleware } = require("../controllers/concerts");

const router = express.Router();

router.route("/:collection_name").get(getAllTicketsWithIDs);
router
  .route("/:collection_name/delete")
  .delete(isAdminMiddleware, deleteTicketsByIds);
router.route("/:collection_name/:id").patch(checkTicket);
router.route("/:collection_name/:position").get(getTicketByPosition);
router
  .route("/:collection_name/:id")
  .post(isAdminMiddleware, toggleTicketValidity);
router.route("/find_by_email/:collection_name/:email").get(getTicketByEmail);

module.exports = router;
