import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/product.model";
import "@/models/media.model"; // ✅ Register Media model

export async function GET() {
  try {
      await connectDB();
      
      
      // ✅ Fetch featured products (not deleted)
      const product = await ProductModel.find({
          deletedAt: null, // corrected field name
        })
        .populate("media")
        .limit(12)
        .lean();

    if (!product || product.length === 0) {
      return response(false, 404, "No product found");
    }

    return response(true, 200, "Product found", product);
  } catch (error) {
    console.error("[FEATURED PRODUCT ERROR]:", error);
    return catchError(error);
  }
}
