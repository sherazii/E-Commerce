import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    asset_id: {
      type: String,
      required: true,
      unique: true, // creates an index automatically
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      unique: true, // creates an index automatically
      trim: true,
    },
    path: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    thumbnail_url: {
      type: String,
      default: null,
    },
    alt: {
      type: String,
      default: "",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


const MediaModel =
  mongoose.models.Media || mongoose.model("Media", mediaSchema, "medias");

export default MediaModel;
