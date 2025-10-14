import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import CategoryModel from "@/models/category.model";

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

    // ✅ DB Connection
    await connectDB();

    // ✅ Extract payload
    const { ids = [], deleteType } = await request.json();

    // ✅ Validate IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty ID list");
    }

    // ✅ Check if records exist
    const categories = await CategoryModel.find({ _id: { $in: ids } });
    if (!categories.length) {
      return response(false, 400, "Data not found");
    }

    // ✅ Validate deleteType
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "deleteType must be SD (Soft Delete) or RSD (Restore)");
    }

    // ✅ Soft Delete or Restore using updateMany
    const updateValue = deleteType === "SD" ? { deletedAt: new Date() } : { deletedAt: null };
    await CategoryModel.updateMany({ _id: { $in: ids } }, { $set: updateValue });

    return response(
      true,
      200,
      deleteType === "SD" ? "Moved to trash" : "Restored successfully"
    );
  } catch (error) {
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

    await connectDB();

    // ✅ Extract payload
    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty ID list");
    }

    // ✅ Validate deleteType strictly for permanent delete
    if (deleteType !== "PD") {
      return response(false, 400, "deleteType must be PD for permanent deletion");
    }

    // ✅ Confirm data exists
    const categories = await CategoryModel.find({ _id: { $in: ids } }).lean();
    if (!categories.length) {
      return response(false, 400, "Data not found");
    }

    // ✅ Delete from database
    await CategoryModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data permanently deleted");
  } catch (error) {
    return catchError(error);
  }
}
