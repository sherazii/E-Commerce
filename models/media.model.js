import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, // URL or file path for thumbnail image
      default: null,
    },
    url: {
      type: String,
      required: true,
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
    timestamps: true, // adds createdAt and updatedAt
  }
);

const MediaModel =
  mongoose.models.Media || mongoose.model("Media", mediaSchema, "medias");

export default MediaModel;
