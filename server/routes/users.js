const express = require("express");
const router = express.Router();

const { getAllUsers, createUser, findUser } = require("../controllers/users");

router.route("/").get(getAllUsers).post(createUser);
router.route("/:type/:value").get(findUser);

module.exports = router;
// Routes
