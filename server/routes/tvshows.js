const express = require("express");

const { getTvShows, postTvShow } = require("../controllers/tv-controller");

router = express.Router();

router.get("/", getTvShows);
router.post("/", postTvShow);

module.exports = router;
