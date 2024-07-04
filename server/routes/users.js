const express = require("express");

const {
  postUser,
  getUsers,
  deleteUser,
} = require("../controllers/users-controller");

const router = express.Router();

router.get("/", getUsers);

router.post("/add", postUser);
router.delete("/delete", deleteUser);

module.exports = router;
