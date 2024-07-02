const express = require("express");
const { postUsers, getUsers } = require("../controllers/users-controller");

router = express.Router();

router.get("/", getUsers);
router.post("/add", postUsers);

module.exports = router;