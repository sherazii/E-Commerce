import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import ProductModel from "@/models/product.model";

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
    const getProduct = await ProductModel.find(filter).select('-media -description')
      .sort({ createdAt: -1 })
      .lean();
    if (!getProduct) {
      return response(false, 404, "Category data not found");
    }

    return response(true, 200, "Category found", getProduct);
  } catch (error) {
    return catchError(error);
  }
}
