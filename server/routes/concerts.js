const express = require('express');
const router = express.Router();
const uploadImage = require('../controllers/uploadFile');
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
} = require('../controllers/concerts');

router.route('/').get(getAllConcerts);
router.route('/this_week').get(findConcert);
router.route('/create_event').post(createEvent);
router.route('/upload_img').post(uploadImage);
router.route('/search/:type/:search_value').get(searchEventByType);
router.route('/organizer/:organizerId').get(getEventsByOrganizerId);
router.route('/update_event/:id/:type/:value').put(updateConcertProperty);
router.route('/resellers/:userId').post(resellersConcertInfo);
router.route('/update/:concertId').post(updateConcert);
router.route('/get_event_within_dates').post(getEventsWithinDates);
router.route('/:type/:value').get(findConcert);
router.route('/get_hot_events').get(calculateEvents);

module.exports = router;
