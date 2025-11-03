import { connectDB } from "@/lib/databaseConnection";
import { reviewSchema } from "@/lib/zodSchema";
import mongoose from "mongoose";
import { response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();
    

    // ✅ ZOD VALIDATION
    const validated = reviewSchema.safeParse(payload);
    if (!validated.success) {
      return response(
        false,
        400,
        "Invalid or missing fields",
        validated.error.errors
      );
    }

    const { product, userid, rating, title, review } = validated.data;

    // ✅ ADD REVIEW TO DB
    const newReview = new ReviewModel({
      product: new mongoose.Types.ObjectId(product),
      user: new mongoose.Types.ObjectId(userid),
      rating,
      title,
      review,
    });

    await newReview.save();

    return response(true, 201, "Review submitted successfully", newReview);
  } catch (error) {
    console.error("Review API Error:", error);
    return response(false, 500, "Internal server error", error);
  }
}
