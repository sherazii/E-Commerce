import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    // 🔗 Reference to parent product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // 🟩 Variant attributes
    color: { type: String, trim: true },
    size: { type: String, trim: true },
    sku: { type: String, required: true, unique: true, trim: true }, // unique stock keeping unit

    // 💰 Pricing (can override main product's)
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },

    // 🖼️ Variant-specific media
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: false, // allow fallback to product's media
      },
    ],

    // 📦 Inventory
    stock: { type: Number, default: 0 },

    // 🗑️ Soft delete
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);


const ProductVariantModel =
  mongoose.models.ProductVariant ||
  mongoose.model("ProductVariant", productVariantSchema, "productvariants");

export default ProductVariantModel;
