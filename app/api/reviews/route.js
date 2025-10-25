import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import ReviewModel from "@/models/Review.model";
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
      if (filter.id === "product") {
        matchQuery["productData.name"] = {
          $regex: filter.value,
          $options: "i",
        };
      } else if (filter.id === "user") {
        matchQuery["userData.name"] = { $regex: filter.value, $options: "i" };
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
    const aggregatePipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: { path: "$productData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: { path: "$usertData", preserveNullAndEmptyArrays: true },
      },
    ];

    // ✅ Global search
    if (globalFilter) {
      const regex = new RegExp(globalFilter, "i");
      aggregatePipeline.push({
        $match: {
          $or: [
            { "productData.name": { $regex: globalFilter, $options: "i" } },
            { "userData.name": { $regex: globalFilter, $options: "i" } },
            { rating: { $regex: globalFilter, $options: "i" } },
            { name: { $regex: globalFilter, $options: "i" } },
            { review: { $regex: globalFilter, $options: "i" } },
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
          product : "$productData.name",
          user : "$userData.name",
          rating : 1,
          review : 1,
          title : 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      }
    );

    // ✅ Query + Count
    const getReview = await ReviewModel.aggregate(aggregatePipeline);
    const totalRowCount = await ReviewModel.countDocuments(matchQuery);

    // ✅ Success response
    return NextResponse.json({
      success: true,
      data: getReview,
      meta: { totalRowCount },
    });
  } catch (error) {
    console.error("❌ Coupon GET error:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
