import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    deletedAt: { type: Date, default: null }, // ✅ Soft delete field
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const CategoryModel =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default CategoryModel;
