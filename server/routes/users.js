const express = require("express");
const router = express.Router();

const { getAllUsers, createUser, findUser } = require("../controllers/users");

router.route("/").get(getAllUsers).post(createUser);
router.route("/:email").get(findUser);

module.exports = router;
// Routes
