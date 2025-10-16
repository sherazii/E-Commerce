const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim:true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    mrp: { type: Number, required: true }, // Maximum Retail Price
    sellingPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },

    media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true }], // Array of image URLs or file paths

    description: { type: String, require: true },

    deletedAt: { type: Date, default: null, index: true }, // Soft delete support
  },
  { timestamps: true } // createdAt, updatedAt
);

// Index for faster category-based queries
productSchema.index({ category: 1 });

module.exports = mongoose.model("Product", productSchema);
