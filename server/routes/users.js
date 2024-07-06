const express = require("express");
const {
  postUser,
  getUsers,
  deleteUser,
  getUserCategories,
  getUserById,
  getUserCategoryEntries,
  patchUsernameById,
} = require("../controllers/users-controller");

const router = express.Router();

router.get("/", getUsers);
router.post("/", postUser);
router.delete("/delete", deleteUser);
router.get("/:user_id", getUserById);
router.get("/:user_id/categories", getUserCategories);
router.get("/:user_id/:category", getUserCategoryEntries);
router.patch("/:user_id/username", patchUsernameById);

module.exports = router;
