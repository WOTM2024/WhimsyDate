const express = require("express");
const {
  postUser,
  getUsers,
  deleteUser,
  getUserCategories,
} = require("../controllers/users-controller");

const router = express.Router();

router.get("/", getUsers);
router.post("/", postUser);
router.delete("/delete", deleteUser);
router.get("/categories", getUserCategories);

module.exports = router;
