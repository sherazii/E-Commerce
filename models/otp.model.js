import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    otp: {
      type: String,
      required: [true, "OTP is required"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Auto delete after 5 minutes (TTL index)
    },

    expiresAt: {
      type: Date,
      required: true,
      // ✅ Correct way to compute 10 minutes ahead
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ TTL index on expiresAt (auto-delete when time is reached)
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel =
  mongoose.models.OTP || mongoose.model("OTP", OTPSchema, "otps");

export default otpModel;
