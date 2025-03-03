const Category = require("../../models/Category");
const addCategoryOption = async (req, res) => {
  try {
    const { id, label } = req.body;

    if (!id || !label) {
      return res.status(400).json({
        success: false,
        message: "Both 'id' and 'label' are required.",
      });
    }

    const category = await Category.findOneAndUpdate(
      { name: "category" }, // Find the existing category (default category)
      {
        $push: { options: { id, label } }, // Add new option to 'options' array
      },
      { new: true, upsert: true } // Return the updated document, create if not exists
    );

    res.status(200).json({
      success: true,
      message: "Option added successfully.",
      data: category,
    });
  } catch (error) {
    console.error("Error adding option:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const category = await Category.findOne({ name: "category" }).select(
      "options"
    );

    if (!category || !category.options) {
      return res.status(404).json({
        success: false,
        message: "Category options not found",
      });
    }

    return res.status(200).json({
      success: true,
      options: category.options, // Return only options
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    console.log(category);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, { name });
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category document and remove the specific option
    const updatedCategory = await Category.findOneAndUpdate(
      { name: "category" },
      { $pull: { options: { _id: id } } }, // Removes the category with matching id
      { new: true } // Returns updated document after deletion
    );

    // If no category was found or the option was not in the list
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category option not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addCategoryOption,
  getAllCategories,
  updateCategory,
  getCategoryById,
  deleteCategory,
};
