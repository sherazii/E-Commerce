import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import OrderModel from "@/models/OrderModel";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const body = await request.json();

    const { _id, status } = body;

    if (!_id || status === undefined || status === null) {
      return response(false, 400, "Order id and status is required");
    }

    const orderData = await OrderModel.findById(_id);

    if (!orderData) {
      return response(false, 404, "Order not found");
    }


    orderData.orderStatus = status;
    await orderData.save();

    return response(true, 200, "Order updated", orderData);
  } catch (error) {
    return catchError(error, "Failed to update order status");
  }
}
