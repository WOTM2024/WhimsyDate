const express = require("express");
const { postMovies, getMovies } = require("../controllers/films-controller");

router = express.Router();

router.get("/", getMovies);
router.post("/add", postMovies);

module.exports = router;
