import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import OrderModel from "@/models/OrderModel";


/**
 * PUT → Soft Delete (SD) or Restore (RSD)
*/
export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) return response(false, 403, "Unauthorized");

    await connectDB();

    const { ids = [], deleteType } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0)
      return response(false, 400, "Invalid or empty ID list");

    if (!["SD", "RSD"].includes(deleteType))
      return response(false, 400, "deleteType must be 'SD' or 'RSD'");

    const orders = await OrderModel.find({ _id: { $in: ids } });
    if (!orders.length) return response(false, 404, "Order not found");

    const updateValue =
      deleteType === "SD"
        ? { deletedAt: new Date() }
        : { deletedAt: null };

    // ✅ Soft Delete / Restore Order + All products inside it
    await OrderModel.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          deletedAt: updateValue.deletedAt,
          "products.$[].deletedAt": updateValue.deletedAt, 
        },
      }
    );

    return response(
      true,
      200,
      deleteType === "SD"
        ? "Order moved to trash successfully"
        : "Order restored successfully"
    );
  } catch (error) {
    console.error("❌ [ORDER PUT ERROR]:", error);
    return catchError(error);
  }
}


/**
 * DELETE → Permanent Delete (PD)
 */
export async function DELETE(request) {
  try {
    // ✅ Authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Extract and validate payload
    const { ids = [], deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "deleteType must be 'PD' for permanent deletion");
    }

    // ✅ Check existence
    const order = await OrderModel.find({ _id: { $in: ids } }).lean();
    if (!order.length) {
      return response(false, 404, "Order not found");
    }

    // ✅ Permanently delete
    await OrderModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Order permanently deleted");
  } catch (error) {
    console.error("❌ [ORDER DELETE ERROR]:", error);
    return catchError(error);
  }
}
