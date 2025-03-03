const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      default: "Category", // Default label
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      default: "category", // Default name
    },
    options: [
      {
        id: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        label: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
