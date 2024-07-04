const express = require("express");
const { postUsers, getUsers, deleteUser } = require("../controllers/users-controller");
const { router } = require("../app");

router = express.Router();

router.get("/", getUsers);
router.post("/add", postUsers);
router.delete("/delete", deleteUser)

module.exports = router;