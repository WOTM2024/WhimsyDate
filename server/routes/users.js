const express = require("express");
const { postUser, getUsers, deleteUser, getUserCategories, getUserById } = require("../controllers/users-controller");

const router = express.Router();

router.get("/", getUsers);
router.post("/add", postUser);
router.delete("/delete", deleteUser);
router.get("/categories", getUserCategories);
router.get("/:user_id", getUserById)


module.exports = router;
