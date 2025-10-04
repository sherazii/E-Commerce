import mongoose from "mongoose";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";

/**
 * ✅ Email Verification API Route
 * This route verifies a user's email by decoding the JWT token 
 * and updating their `isEmailVerified` status in the database.
 */
export async function POST(request) {
  try {
    // 🧩 Step 1: Connect to the database
    await connectDB();

    // 📨 Step 2: Extract token from request body
    const { token } = await request.json();
    if (!token) return response(false, 400, "Missing token!");

    // 🔑 Step 3: Verify JWT using the secret key
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) throw new Error("SECRET_KEY missing in .env.local");

    const secret = new TextEncoder().encode(secretKey);
    const decoded = await jwtVerify(token, secret);

    // 🧠 Step 4: Extract userId from decoded token payload
    let userId = decoded.payload.userId;

    // Handle cases where userId is stored as a buffer (common in serialized Mongo IDs)
    if (userId?.buffer) {
      const bufValues = Object.values(userId.buffer);
      const buf = Buffer.from(bufValues);
      userId = buf.toString("hex");
    }

    // Validate userId type
    if (typeof userId !== "string") {
      return response(false, 400, "Invalid userId format");
    }

    // 🆔 Step 5: Convert userId to Mongo ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // 👤 Step 6: Find the user and update verification status
    const user = await UserModel.findById(objectId);
    if (!user) return response(false, 404, "User not found!");

    user.isEmailVerified = true;
    await user.save();

    // ✅ Step 7: Send success response
    return response(true, 200, "Email verification successful!");
  } catch (error) {
    // 🔥 Handle and return server errors gracefully
    return catchError(error);
  }
}
