import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import CategoryModel from "@/models/category.model";
import OrderModel from "@/models/OrderModel";
import ProductModel from "@/models/product.model";
import UserModel from "@/models/User.model";

export async function GET(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    const [category, product, customer, order] = await Promise.all([
      CategoryModel.countDocuments({ deletedAt: null }),
      ProductModel.countDocuments({ deletedAt: null }),
      UserModel.countDocuments({ deletedAt: null }),
      OrderModel.countDocuments({ deletedAt: null }),
    ]);

    return response(true, 200, "Dashboard count", {
      category,
      product,
      customer,
      order
    });
  } catch (error) {
    console.error("❌ Coupon GET error:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
