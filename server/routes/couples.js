const express = require("express");
const { postCouple, getCouples, deleteCouple, getCoupleById } = require("../controllers/couples-controller");

const router = express.Router();

router.get("/", getCouples);
router.get("/:couple_id", getCoupleById);
router.post("/add", postCouple);
router.delete("/delete", deleteCouple);

module.exports = router;
