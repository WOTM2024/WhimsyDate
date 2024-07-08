const express = require("express");

const tvShows = require("./tvshows");
const movies = require("./movies");
const users = require("./users");
const foods = require("./foods");
const activities = require("./activities");
const couples = require("./couples");

const router = express.Router();

router.use("/tvshows", tvShows);
router.use("/movies", movies);
router.use("/users", users);
router.use("/activities", activities);
router.use("/foods", foods);
router.use("/couples", couples);

module.exports = router;
