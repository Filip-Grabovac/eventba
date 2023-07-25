const express = require('express');
const router = express.Router();

const {
  getEntranceControllerById,
  addEntranceController,
  deleteEntranceController,
  getEntranceControllerByUsername,
  updateEntranceControllerById,
} = require('../controllers/entrance');

router.route('/').post(getEntranceControllerById);
router.route('/username').post(getEntranceControllerByUsername);
router.route('/add_entrance_checker').post(addEntranceController);
router.route('/delete_controller').post(deleteEntranceController);
router.route('/update_controller/:id').put(updateEntranceControllerById);

module.exports = router;
