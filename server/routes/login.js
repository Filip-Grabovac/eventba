const express = require("express");
const handleLogin = require("../controllers/login");
const router = express.Router();

router.route("/").post(handleLogin);

module.exports = router;
