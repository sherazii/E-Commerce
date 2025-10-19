import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { isValidObjectId } from "mongoose";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET(request, { params }) {
    
  try {
    // ✅ Authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    // ✅ Await params (since Next.js 15 treats it as a Promise)
    const { id } = await params;

    // ✅ Validate ID
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Object ID");
    }

    // ✅ Fetch productVariant and populate references
    const productVariant = await ProductVariantModel.findOne({
      _id: id,
      deletedAt: null,
    })
      .populate("media") // gets media details (secure_url, etc.)
      .lean();

    if (!productVariant) {
      return response(false, 404, "No productVariant found");
    }

    return response(true, 200, "Product found", productVariant);
  } catch (error) {
    return catchError(error);
  }
}
