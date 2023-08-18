const express = require("express");
const router = express.Router();

const { getSponsorList, updateSponsorList } = require("../controllers/helper");

router.route("/sponsors").get(getSponsorList).post(updateSponsorList);

module.exports = router;
