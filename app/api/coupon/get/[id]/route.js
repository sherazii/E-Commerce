import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import CuponModel from "@/models/Coupon.model";
import { isValidObjectId } from "mongoose";

// ✅ Get single coupon by ID
export async function GET(request, { params }) {
  try {
    // ✅ Authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect DB
    await connectDB();

    // ✅ Await params (Next.js 15 uses async params)
    const { id } = await params;

    // ✅ Validate ID
    if (!id || !isValidObjectId(id)) {
      return response(false, 400, "Invalid or missing Object ID");
    }

    // ✅ Fetch coupon
    const coupon = await CuponModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();

    if (!coupon) {
      return response(false, 404, "Coupon not found");
    }

    return response(true, 200, "Coupon found successfully", coupon);
  } catch (error) {
    console.error("❌ [COUPON GET ERROR]:", error);
    return catchError(error, "Failed to fetch coupon");
  }
}
