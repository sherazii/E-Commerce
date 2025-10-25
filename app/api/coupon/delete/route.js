import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import CuponModel from "@/models/Coupon.model";

/**
 * PUT → Soft Delete (SD) or Restore (RSD)
 */
export async function PUT(request) {
  try {
    // ✅ Authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Extract and validate payload
    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "deleteType must be 'SD' (Soft Delete) or 'RSD' (Restore)"
      );
    }

    // ✅ Check existence
    const coupons = await CuponModel.find({ _id: { $in: ids } });
    if (!coupons.length) {
      return response(false, 404, "Coupons not found");
    }

    // ✅ Apply soft delete or restore
    const updateValue =
      deleteType === "SD" ? { deletedAt: new Date() } : { deletedAt: null };

    await CuponModel.updateMany({ _id: { $in: ids } }, { $set: updateValue });

    return response(
      true,
      200,
      deleteType === "SD"
        ? "Coupons moved to trash successfully"
        : "Coupons restored successfully"
    );
  } catch (error) {
    console.error("❌ [COUPON PUT ERROR]:", error);
    return catchError(error);
  }
}

/**
 * DELETE → Permanent Delete (PD)
 */
export async function DELETE(request) {
  try {
    // ✅ Authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Extract and validate payload
    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "deleteType must be 'PD' for permanent deletion");
    }

    // ✅ Check existence
    const coupons = await CuponModel.find({ _id: { $in: ids } }).lean();
    if (!coupons.length) {
      return response(false, 404, "Coupons not found");
    }

    // ✅ Permanently delete
    await CuponModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Coupons permanently deleted");
  } catch (error) {
    console.error("❌ [COUPON DELETE ERROR]:", error);
    return catchError(error);
  }
}
