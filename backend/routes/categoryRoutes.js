const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryControllers");

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

router.get("/", verifyToken, getCategories);
router.get("/:id", verifyToken, getCategoryById);

router.post(
  "/",
  verifyToken,
  isAdmin,
  addCategory
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateCategory
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteCategory
);

module.exports = router;