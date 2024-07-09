const express = require("express");
const {
  getFoods,
  postFoods,
  patchByFoodId,
} = require("../controllers/foods-controller");

router = express.Router();

router.get("/", getFoods);
router.post("/", postFoods);
router.patch("/:id", patchByFoodId);

module.exports = router;
