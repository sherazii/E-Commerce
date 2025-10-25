import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import CuponModel from "@/models/Coupon.model";
import { NextResponse } from "next/server";

// ✅ Get all coupons
export async function GET(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Parse query params
    const searchParams = request.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const globalFilter = searchParams.get("globalFilter") || "";
    const deleteType = searchParams.get("deleteType");

    const safeParse = (param, fallback) => {
      try {
        return JSON.parse(param || fallback);
      } catch {
        return JSON.parse(fallback);
      }
    };

    const filters = safeParse(searchParams.get("filters"), "[]");
    const sorting = safeParse(searchParams.get("sorting"), "[]");

    // ✅ Match query
    let matchQuery = {};
    if (deleteType === "SD") {
      matchQuery.deletedAt = { $in: [null, undefined] };
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }

    // ✅ Column-based filters
    filters.forEach((filter) => {
      if (
        filter.id === "minShoppingAmount" ||
        filter.id === "discountPercentage"
      ) {
        matchQuery[filter.id] = Number(filter.value);
      } else if (filter.id === "validity") {
        matchQuery[filter.id] = new Date(filter.value);
      } else {
        matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    });

    // ✅ Sorting
    const sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // ✅ Aggregation pipeline
    const aggregatePipeline = [{ $match: matchQuery }];

    // ✅ Global search
    if (globalFilter) {
      const regex = new RegExp(globalFilter, "i");
      aggregatePipeline.push({
        $match: {
          $or: [
            { code: regex },
            { discountPercentage: regex },
            { minShoppingAmount: regex },
          ],
        },
      });
    }

    aggregatePipeline.push(
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          code: 1,
          discountPercentage: 1,
          minShoppingAmount: 1,
          validity: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      }
    );

    // ✅ Query + Count
    const getCoupon = await CuponModel.aggregate(aggregatePipeline);
    const totalRowCount = await CuponModel.countDocuments(matchQuery);

    // ✅ Success response
    return NextResponse.json({
      success: true,
      data: getCoupon,
      meta: { totalRowCount },
    });
  } catch (error) {
    console.error("❌ Coupon GET error:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
