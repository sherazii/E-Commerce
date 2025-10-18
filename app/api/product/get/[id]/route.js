import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import ProductModel from "@/models/product.model";
import { isValidObjectId } from "mongoose";
import MediaModel from "@/models/media.model";

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

    // ✅ Fetch product and populate references
    const product = await ProductModel.findOne({
      _id: id,
      deletedAt: null,
    })
      .populate("media") // gets media details (secure_url, etc.)
      .populate("category", "name _id") // gets category info
      .lean();

    if (!product) {
      return response(false, 404, "No product found");
    }

    return response(true, 200, "Product found", product);
  } catch (error) {
    return catchError(error);
  }
}
