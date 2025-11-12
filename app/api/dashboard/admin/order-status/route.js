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

    const orderStatus = await OrderModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $group: {_id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: 1 },
      },
    ]);

    return response(true, 200, "data found", orderStatus);
  } catch (error) {
    return catchError(error);
  }
}
