const express = require("express");
const { postMovie, getMovies } = require("../controllers/movie-controller");

router = express.Router();

router.get("/", getMovies);
router.post("/", postMovie);

module.exports = router;
