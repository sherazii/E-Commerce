import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import OrderModel from "@/models/OrderModel";

export async function GET(request) {
  try {
    
    // ✅ Connect to DB
    await connectDB();
    // ✅ Authentication check
    const auth = await isAuthenticated("user");
    if (!auth?.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    const userId = auth.userId;

    //get recent orders
    const recentOrders = await OrderModel.find({userId: userId}).lean()
    const totalOrderCount = await OrderModel.countDocuments({userId: userId})


    return response(true, 200, 'Dashboard infos', {recentOrders, totalOrderCount})
   
  } catch (error) {
    console.error("❌ Coupon GET error:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
