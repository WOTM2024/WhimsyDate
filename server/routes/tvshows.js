const express = require("express");

const { getTvShows, postTvShows } = require("../controllers/tv-controller");

router = express.Router();

router.get("/", getTvShows);
router.post("/", postTvShows);

module.exports = router;
