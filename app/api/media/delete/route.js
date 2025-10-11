import cloudinary from "@/lib/cloudinaryConfig";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import mongoose from "mongoose";

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

    // ✅ Check if data exists
    const media = await MediaModel.find({ _id: { $in: ids } });
    if (!media.length) {
      return response(false, 400, "Data not found");
    }
    

    // ✅ Validate deleteType
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation, deleteType must be SD or RSD"
      );
    }

    
    // ✅ Soft Delete or Restore
    if (deleteType === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
    } else {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }

    

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
 * DELETE → Permanently Delete (PD)
 */
export async function DELETE(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty ID list");
    }

    // ✅ Validate deleteType strictly for permanent delete
    if (deleteType !== "PD") {
      return response(false, 400, "Invalid deleteType, must be PD");
    }

    // ✅ Fetch media to delete
    const media = await MediaModel.find({ _id: { $in: ids } })
      .session(session)
      .lean();
    if (!media.length) {
      return response(false, 400, "Data not found");
    }

    // ✅ Delete from database
    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    // ✅ Delete from Cloudinary
    const publicIds = media.map((m) => m.public_id);
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 500, "Failed to delete from Cloudinary");
    }

    // ✅ Commit and close session
    await session.commitTransaction();
    session.endSession();

    return response(true, 200, "Data permanently deleted");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}
