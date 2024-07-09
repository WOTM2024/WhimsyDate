const express = require("express");
const {
  postUser,
  getUsers,
  deleteUser,
  getUserCategories,
  getUserById,
  getUserCategoryEntries,
  postEntryToUserCategory, 
  patchUserEntriesByEntryId,
  patchUsernameById,
} = require("../controllers/users-controller");

const router = express.Router();

router.get("/", getUsers);
router.post("/", postUser);
router.delete("/delete", deleteUser);
router.get("/:user_id", getUserById);
router.patch("/:user_id/username", patchUsernameById);
router.get("/:user_id/categories", getUserCategories);
router.get("/:user_id/:category", getUserCategoryEntries);
router.post("/:user_id/:category", postEntryToUserCategory)
router.patch("/:user_id/:category", patchUserEntriesByEntryId)

module.exports = router;
