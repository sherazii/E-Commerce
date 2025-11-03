import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    // ✅ Validate productId
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return response(false, 400, "Invalid or missing productId");
    }

    // ✅ Aggregation: group reviews by rating
    const reviews = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ✅ Ensure all 1–5 star buckets exist even if count = 0
    const rating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      rating[r._id] = r.count;
    });

    const totalReview = Object.values(rating).reduce((sum, c) => sum + c, 0);

    // ✅ Average rating (rounded to 1 decimal)
    const averageRating =
      totalReview > 0
        ? (
            Object.entries(rating).reduce(
              (sum, [star, count]) => sum + star * count,
              0
            ) / totalReview
          ).toFixed(1)
        : "0.0";

    // ✅ Calculate percentage graph data for frontend bars
    const percentage = Object.fromEntries(
      Object.entries(rating).map(([key, value]) => [
        key,
        totalReview === 0 ? 0 : ((value / totalReview) * 100).toFixed(1),
      ])
    );

    return response(true, 200, "Review details fetched", {
      totalReview,
      averageRating,
      rating,
      percentage,
    });
  } catch (error) {
    console.error("❌ Review API Error:", error);
    return response(false, 500, "Internal server error", error);
  }
}
