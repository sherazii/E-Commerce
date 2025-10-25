import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import ReviewModel from "@/models/Review.model";

export async function GET(request) {
  try {
    // ✅ Admin authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to database
    await connectDB();

    // ✅ Fetch only non-deleted review
    const review = await ReviewModel
    .find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Handle empty dataset
    if (!review || review.length === 0) {
      return response(false, 404, "No review found");
    }

    return response(true, 200, "Review retrieved successfully", review);
  } catch (error) {
    console.error("❌ [COUPON LIST ERROR]:", error); 
    return catchError(error, "Failed to fetch review");
  }
}
