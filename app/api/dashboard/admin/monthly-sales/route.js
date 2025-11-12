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

    const monthlySales = await OrderModel.aggregate([
      {
        $match: {
          deletedAt: null,
          orderStatus: {
            $in: [
              "processing",
              "shipped",
              "delivered",
              "cancelled",
              "unverified",
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$finalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return response(true, 200, "data found", monthlySales);
  } catch (error) {
    return catchError(error);
  }
}
