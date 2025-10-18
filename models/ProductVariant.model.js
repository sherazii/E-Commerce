import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
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
    sku: { type: Number, required: true },

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

const ProductVariantModel =
  mongoose.models.ProductVAriant ||
  mongoose.model("ProductVAriant", productVariantSchema, "productvariants");

export default ProductVariantModel;
