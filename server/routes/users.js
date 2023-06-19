const express = require("express");
const router = express.Router();

const { getAllUsers, createUser } = require("../controllers/users");

router.route("/").get(getAllUsers).post(createUser);

module.exports = router;
// Routes
