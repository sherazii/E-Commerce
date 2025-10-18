import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    mrp: { type: Number, required: true }, // Maximum Retail Price
    sellingPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },

    // Array of media files (e.g., image or video IDs)
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],

    description: { type: String, required: true }, // ✅ fixed "require" → "required"

    deletedAt: { type: Date, default: null, index: true }, // Soft delete support
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Index for faster category-based queries
productSchema.index({ category: 1 });

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema, "products");

export default ProductModel;
