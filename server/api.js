const express = require("express");

const tvShows = require("./routes/tvshows");
const movies = require("./routes/movies");
const users = require("./routes/users");
const foods = require("./routes/foods");
const activities = require("./routes/activities");
const couples = require("./routes/couples");

const router = express.Router();

router.use("/tvshows", tvShows);
router.use("/movies", movies);
router.use("/users", users);
router.use("/activities", activities);
router.use("/foods", foods);
router.use("/couples", couples);

module.exports = router;
