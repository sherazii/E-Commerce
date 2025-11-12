import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import ReviewModel from "@/models/Review.model";

export async function GET(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Fetch latest reviews (not deleted)
    const latestReview = await ReviewModel.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        select: "name media",
        populate: {
          path: "media",
          select: "secure_url"
        }
      });
      

    return response(true, 200, "Data found", latestReview);
  } catch (error) {
    return catchError(error);
  }
}
