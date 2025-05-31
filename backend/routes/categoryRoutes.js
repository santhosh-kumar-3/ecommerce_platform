const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
