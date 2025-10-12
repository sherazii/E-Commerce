import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/databaseConnection"; // ✅ You forgot to import this
import MediaModel from "@/models/media.model";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/serverHelper";

export async function GET(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorised");
    }

    // ✅ Connect to database
    await connectDB();

    // ✅ Extract query params: ?page=1&limit=10&deleteType=SD
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page"), 10) || 0;
    const limit = parseInt(searchParams.get("limit"), 10) || 10;
    const deleteType = searchParams.get("deleteType");

    // ✅ Build filter based on deleteType (SD = Soft Deleted?, PD = Permanently Deleted?)
    let filter = {};

    if (deleteType === "SD") {
      filter = { deletedAt: null };
    } else if (deleteType === "PD") {
      filter = { deletedAt: { $ne: null } };
    }

    // ✅ Fetch paginated media list
    const mediaData = await MediaModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit) // Skip previous records based on page
      .limit(limit) // Limit to page size
      .lean(); // Convert from MongoDB document to JS object
    // Total data
    const totalMedia = await MediaModel.countDocuments(filter); // ✅ Correct

    return NextResponse.json({
      mediaData,
      totalMedia,
      hasMore: (page + 1) * limit < totalMedia, // ✅ Returns true/false instead of number
    });
  } catch (error) {
    return catchError(error);
  }
}
