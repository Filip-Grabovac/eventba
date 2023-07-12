const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  findUser,
  updateUser,
} = require("../controllers/users");

router.route("/").get(getAllUsers).post(createUser);
router.route("/:type/:value").get(findUser);
router.route("/:id").patch(updateUser);

module.exports = router;
