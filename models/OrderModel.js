import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    name: String,
    url: String,
    size: String,
    color: String,
    mrp: Number,
    sellingPrice: Number,
    media: String,
    qty: {
      type: Number,
      required: true,
    },
    
    deletedAt: { type: Date, default: null, index: true }, 
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // ✅ Customer Info (validatedOrderInfo)
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    ordernote: { type: String },

    isCashOnDelivery: {
      type: Boolean,
      required: true,
      default: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // ✅ Products List (verifiedCartData)
    products: [orderProductSchema],

    // ✅ Pricing Summary
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ["pending","processing", "shipped", "delivered", "cancelled", "unverified"],
      default: "pending",
    },
    
    deletedAt: { type: Date, default: null, index: true }, 
  },
  { timestamps: true }
);

// Avoid model overwrite error in development
const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema, "orders");
export default OrderModel;
