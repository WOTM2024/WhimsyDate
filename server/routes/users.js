const express = require("express");
const { postUser, getUsers } = require("../controllers/users-controller");

router = express.Router();

router.get("/", getUsers);
router.post("/add", postUser);

module.exports = router;
