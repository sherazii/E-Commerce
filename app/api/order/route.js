import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import OrderModel from "@/models/OrderModel";
import { NextResponse } from "next/server";

// ✅ Get all Orders (with sorting + filtering + pagination)
export async function GET(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    // ✅ Query Params
    const searchParams = request.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const globalFilter = searchParams.get("globalFilter") || "";
    const deleteType = searchParams.get("deleteType");

    const safeParse = (value, fallback) => {
      try {
        return JSON.parse(value || fallback);
      } catch {
        return JSON.parse(fallback);
      }
    };

    const filters = safeParse(searchParams.get("filters"), "[]");
    const sorting = safeParse(searchParams.get("sorting"), "[]");

    // ✅ Deleted/Non-deleted filter
    let matchQuery = {};
    if (deleteType === "SD") matchQuery.deletedAt = { $in: [null, undefined] };
    if (deleteType === "PD") matchQuery.deletedAt = { $ne: null };

    // ✅ Column-based filters
    filters.forEach((filter) => {
      matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
    });

    // ✅ Sorting
    const sortQuery = {};
    sorting.forEach((sort) => (sortQuery[sort.id] = sort.desc ? -1 : 1));

    // ✅ Aggregation Pipeline
    const aggregatePipeline = [{ $match: matchQuery }];

    // ✅ Global Search
    if (globalFilter) {
      aggregatePipeline.push({
        $match: {
          $or: [
            { order_id: { $regex: globalFilter, $options: "i" } },
            { payment_id: { $regex: globalFilter, $options: "i" } },
            { name: { $regex: globalFilter, $options: "i" } },
            { email: { $regex: globalFilter, $options: "i" } },
            { phone: { $regex: globalFilter, $options: "i" } },
            { country: { $regex: globalFilter, $options: "i" } },
            { state: { $regex: globalFilter, $options: "i" } },
            { city: { $regex: globalFilter, $options: "i" } },
            { pincode: { $regex: globalFilter, $options: "i" } },
            { status: { $regex: globalFilter, $options: "i" } },
          ],
        },
      });
    }

    aggregatePipeline.push(
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size }
    );

    // ✅ Query + Count simultaneously
    const [getOrders, totalRowCount] = await Promise.all([
      OrderModel.aggregate(aggregatePipeline),
      OrderModel.countDocuments(matchQuery),
    ]);

    return NextResponse.json({
      success: true,
      data: getOrders,
      meta: { totalRowCount },
    });
  } catch (error) {
    console.error("❌ Order GET error:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
