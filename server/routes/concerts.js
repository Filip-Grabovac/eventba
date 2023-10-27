const express = require("express");
const router = express.Router();
const uploadImage = require("../controllers/uploadFile");
const {
  findConcert,
  getAllConcerts,
  createEvent,
  searchEventByType,
  getEventsByOrganizerId,
  updateConcertProperty,
  resellersConcertInfo,
  updateConcert,
  calculateEvents,
  getEventsWithinDates,
  findUnverifiedEvents,
  verifyEvent,
  deleteEvent,
  updateEventData,
  getProvisionSum,
  isAdminMiddleware,
} = require("../controllers/concerts");

router.route("/").get(getAllConcerts);
router.route("/this_week").get(findConcert);
router.route("/create_event").post(createEvent);
router.route("/upload_img").post(uploadImage);
router.route("/search/:type/:search_value").get(searchEventByType);
router.route("/organizer/:organizerId").get(getEventsByOrganizerId);
router
  .route("/update_event/:id/:type/:value")
  .put(isAdminMiddleware, updateConcertProperty);
router.route("/resellers/:userId").post(resellersConcertInfo);
router.route("/update/:concertId").post(updateConcert);
router.route("/update_event").post(isAdminMiddleware, updateEventData);

router.route("/get_event_within_dates").post(getEventsWithinDates);
router.route("/get_event_provision").post(getProvisionSum);
router.route("/:type/:value").get(findConcert);
router.route("/get_hot_events").get(calculateEvents);
router.route("/unverified_events").get(findUnverifiedEvents);
router.route("/verify_event").post(verifyEvent);
router.route("/delete/:id").delete(isAdminMiddleware, deleteEvent);

module.exports = router;
