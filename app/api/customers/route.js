import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import UserModel from "@/models/User.model";
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
      matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
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
            { name: { $regex: globalFilter, $options: "i" } },
            { email: { $regex: globalFilter, $options: "i" } },
            { phoneNumber: { $regex: globalFilter, $options: "i" } },
            { address: { $regex: globalFilter, $options: "i" } },
            { isEmailVerified: { $regex: globalFilter, $options: "i" } },
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
          name: 1,
          email: 1,
          phoneNumber: 1,
          avatar: 1,
          address: 1,
          isEmailVerified: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      }
    );

    // ✅ Query + Count
    const getCUstomers = await UserModel.aggregate(aggregatePipeline);
    const totalRowCount = await UserModel.countDocuments(matchQuery);
    

    // ✅ Success response
    return NextResponse.json({
      success: true,
      data: getCUstomers,
      meta: { totalRowCount },
    });
  } catch (error) {
    console.error("❌ Coupon GET error:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
