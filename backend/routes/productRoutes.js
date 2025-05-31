const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
} = require("../controllers/productController");

const cpUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "subImages", maxCount: 4 },
]);

router.post("/", cpUpload, createProduct);
router.get("/", getProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/search", searchProducts);
router.get("/:id", getProduct);
router.put("/:id", cpUpload, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
