import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import orderModel from "@/models/OrderModel";
import mongoose from "mongoose";

// ✅ Get single order by ID
export async function GET(request, context) {
  try {
    await connectDB();

    // ✅ Unwrap params promise
    const params = await context.params;
    const orderid = params?.orderid;

    if (!orderid || !mongoose.Types.ObjectId.isValid(orderid)) {
      return response(false, 400, "Invalid or missing order ID");
    }

    // ✅ Fetch order directly
    const order = await orderModel.findById(orderid);

    if (!order) {
      return response(false, 404, "Order not found");
    }

    return response(true, 200, "Order found successfully", order);
  } catch (error) {
    console.error("❌ [ORDER GET ERROR]:", error);
    return catchError(error, "Failed to fetch order");
  }
}
