const express = require("express");
const router = express.Router();

const {
  getEntranceControllerById,
  addEntranceController,
  deleteEntranceController,
} = require("../controllers/entrance");

router.route("/").post(getEntranceControllerById);
router.route("/add_entrance_checker").post(addEntranceController);
router.route("/delete_controller").post(deleteEntranceController);

module.exports = router;
