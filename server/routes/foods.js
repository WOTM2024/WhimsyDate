const express = require("express");
const { getFoods, postFoods } = require("../controllers/foods-controller");

router = express.Router();

router.get("/", getFoods);
router.post("/", postFoods);

module.exports = router;
