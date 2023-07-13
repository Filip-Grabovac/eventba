const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  findUser,
  updateUser,
  verifyUser,
} = require("../controllers/users");

router.route("/").get(getAllUsers).post(createUser);
router.route("/:type/:value").get(findUser);
router.route("/:id").patch(updateUser);
router.route("/verify/:verificationCode").patch(verifyUser);

module.exports = router;
