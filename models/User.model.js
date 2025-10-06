import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // 🔒 Hide password by default in queries
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{7,15}$/, "Please enter a valid phone number"],
    },

    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },

    avatar: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// 🔐 Hash password before saving (only when modified)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare plain text password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Prevent model recompilation error in Next.js hot reload
const UserModel =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");

export default UserModel;
