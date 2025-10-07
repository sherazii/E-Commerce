// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("❌ MONGODB_URL is not defined in environment variables!");
}

// ✅ Global caching to prevent multiple connections in dev
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn; // Already connected

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        dbName: "NEXTJS-ECOMMERCE",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully!");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
