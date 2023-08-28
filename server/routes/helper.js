const express = require('express');
const router = express.Router();

const {
  getSponsorList,
  updateSponsorList,
  getHotEvents,
  manageNewsletterSubscription,
  getNewsletterSubscription,
} = require('../controllers/helper');

router
  .route('/newsletter/:id')
  .get(getNewsletterSubscription)
  .put(manageNewsletterSubscription);
router.route('/sponsors').get(getSponsorList).post(updateSponsorList);
router.route('/hot_events').get(getHotEvents);

module.exports = router;
