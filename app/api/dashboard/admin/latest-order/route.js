import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import OrderModel from "@/models/OrderModel";

export async function GET(params) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    const latestOrder = await OrderModel.find({deletedAt: null}).sort({createdAt: -1}).lean();


    return response(true, 200, "Data found", latestOrder);
  } catch (error) {
    return catchError(error);
  }
}
