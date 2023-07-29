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
} = require('../controllers/concerts');

router.route('/this_week').get(findConcert);
router.route('/create_event').post(createEvent);
router.route('/upload_img').post(uploadImage);
router.route('/search/:type/:search_value').get(searchEventByType);
router.route('/organizer/:organizerId').get(getEventsByOrganizerId);
router.route('/update_event/:id/:type/:value').put(updateConcertProperty);
router.route('/:type/:value').get(findConcert);
router.route('/').get(getAllConcerts);

module.exports = router;
