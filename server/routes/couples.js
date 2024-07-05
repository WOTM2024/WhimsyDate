const express = require("express");
const { postCouple, getCouples } = require("../controllers/couples-controller");

const router = express.Router();

router.get("/", getCouples);
router.post("/add", postCouple);

module.exports = router;
