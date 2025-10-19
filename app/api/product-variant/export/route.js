import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const filter = {
      deletedAt: null,
    };
    const getProductVariant = await ProductVariantModel.find(filter).select('-media -description')
      .sort({ createdAt: -1 })
      .lean();
    if (!getProductVariant) {
      return response(false, 404, "Product variant data not found");
    }

    return response(true, 200, "Product variant found", getProductVariant);
  } catch (error) {
    return catchError(error);
  }
}
