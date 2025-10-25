import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import CuponModel from "@/models/Coupon.model";

export async function GET(request) {
  try {
    // ✅ Admin authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to database
    await connectDB();

    // ✅ Fetch only non-deleted coupons
    const coupons = await CuponModel.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Handle empty dataset
    if (!coupons || coupons.length === 0) {
      return response(false, 404, "No coupons found");
    }

    return response(true, 200, "Coupons retrieved successfully", coupons);
  } catch (error) {
    console.error("❌ [COUPON LIST ERROR]:", error);
    return catchError(error, "Failed to fetch coupons");
  }
}
