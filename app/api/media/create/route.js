import cloudinary from "@/lib/cloudinaryConfig";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";

export async function POST(request) {
  try {
    // ✅ Parse request body correctly
    const payload = await request.json();

    // ✅ Authentication check
    const auth = await isAuthenticated("admin");

    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorised");
    }

    // ✅ Connect to database
    await connectDB();

    // ✅ Filter out already existing items before insert (check both asset_id & public_id)
    const publicIds = payload.map((p) => p.public_id);
    const assetIds = payload.map((p) => p.asset_id);

    // 🔍 Find any existing records that match by public_id OR asset_id
    const existing = await MediaModel.find({
      $or: [{ public_id: { $in: publicIds } }, { asset_id: { $in: assetIds } }],
    }).select("public_id asset_id");

    // 🧩 Extract already existing IDs
    const existingPublicIds = existing.map((e) => e.public_id);
    const existingAssetIds = existing.map((e) => e.asset_id);

    // 🚀 Filter out duplicates before insert
    const newItems = payload.filter(
      (p) =>
        !existingPublicIds.includes(p.public_id) &&
        !existingAssetIds.includes(p.asset_id)
    );

    // ⚙️ If everything already exists
    if (newItems.length === 0) {
      return response(true, 200, "All media already exist in database");
    }

    // ✅ Insert only new records into MongoDB
    await MediaModel.insertMany(newItems);

    // 🎉 Success message
    return response(
      true,
      200,
      `${newItems.length} new media uploaded successfully`
    );
  } catch (error) {
    // ✅ Cleanup Cloudinary uploads if DB insert fails
    try {
      const payload = await request.json().catch(() => null); // safe re-read
      if (payload && Array.isArray(payload) && payload.length > 0) {
        const publicIds = payload.map((data) => data.public_id);
        await cloudinary.api.delete_resources(publicIds);
      }
    } catch (deleteError) {
      error.cloudinary = deleteError;
    }

    return catchError(error);
  }
}
