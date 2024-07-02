const express = require("express");
const { postMovies, getMovies } = require("../controllers/movie-controller");

router = express.Router();

router.get("/", getMovies);
router.post("/", postMovies);

module.exports = router;
