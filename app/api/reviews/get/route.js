import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const page = Number(searchParams.get("page")) || 0;

    const limit = 10;
    const skip = page * limit;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return response(false, 400, "Invalid or missing productId");
    }

    // match stage
    const matchQuery = {
      deletedAt: null,
      product: new mongoose.Types.ObjectId(productId),
    };

    // Aggregation Pipeline
    const aggregation = [
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit + 1, // fetch 1 extra to check if next page exists
      },
      {
        $project: {
          _id: 1,
          reviewedBy: "$userData.name",
          avatar: "$userData.avatar",
          rating: 1,
          title: 1,
          review: 1,
          createdAt: 1,
        },
      },
    ];

    const result = await ReviewModel.aggregate(aggregation);

    // Handle pagination logic
    let nextPage = null;
    if (result.length > limit) {
      nextPage = page + 1;
      result.pop(); // remove the extra fetched document
    }

    const totalReview = await ReviewModel.countDocuments(matchQuery);

    return response(true, 200, "Review Data", {
      reviews: result,
      nextPage,
      totalReview,
    });
  } catch (error) {
    console.error("Review API Error:", error);
    return response(false, 500, "Internal server error", error);
  }
}
