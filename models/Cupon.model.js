import mongoose from "mongoose";

const cuponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    discountPercentage: { type: Number, required: true, trim: true },
    minShoppingAmount: { type: Number, required: true, trim: true },
    validity: { type: Date, required: true },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CuponModel =
  mongoose.models.Cupon || mongoose.model("Cupon", cuponSchema, "cupons");

export default CuponModel;
