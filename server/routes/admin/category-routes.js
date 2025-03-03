const express = require("express");
const {
  getCategoryById,
  updateCategory,
  deleteCategory,
  addCategoryOption,
  getAllCategories,
} = require("../../controllers/admin/category-controller");

const router = express.Router();

router.post("/add", addCategoryOption);
router.get("/get", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
