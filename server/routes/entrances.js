const express = require("express");
const router = express.Router();

const {
  getEntranceControllerById,
  addEntranceController,
  deleteEntranceController,
  getEntranceControllerByUsername,
} = require("../controllers/entrance");

router.route("/").post(getEntranceControllerById);
router.route("/username").post(getEntranceControllerByUsername);
router.route("/add_entrance_checker").post(addEntranceController);
router.route("/delete_controller").post(deleteEntranceController);

module.exports = router;
