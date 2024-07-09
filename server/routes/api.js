const express = require("express");
const tvShows = require("./tvshows");
const movies = require("./movies");
const users = require("./users");
const foods = require("./foods");
const activities = require("./activities");
const couples = require("./couples");
const path = require("path");

const router = express.Router();

// this will be our landing page for /api, it'll just send our endpoints.json over to the client.
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../endpoints.json"));
});

router.use("/tvshows", tvShows);
router.use("/movies", movies);
router.use("/users", users);
router.use("/activities", activities);
router.use("/foods", foods);
router.use("/couples", couples);

module.exports = router;
