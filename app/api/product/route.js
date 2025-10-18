import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import ProductModel from "@/models/product.model";
import { NextResponse } from "next/server";

// Get all categories
export async function GET(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");

    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorised");
    }
    // ✅ Connect to DB
    await connectDB();
    
    
    const searchParams = await request.nextUrl.searchParams;
    
    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");
    
    //Build matchQuery
    let matchQuery = {};
    if (deleteType === "SD") {
      matchQuery = { deletedAt: null };
    } else if (deleteType === "PD") {
      matchQuery = { deletedAt: { $ne: null } };
    }
    
    //Global search
    if (globalFilter) {
      matchQuery["$or"] = [
        {
          name: { $regex: globalFilter, $options: "i" },
        },
        {
          slug: { $regex: globalFilter, $options: "i" },
        },
      ];
    }
    
    // Column filtration
    filters.forEach((filter) => {
      matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
    });
    
    //Sorting data
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });
    
    //aggregation pipeline
    const aggregatePipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          category: "$categoryData.name",
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];
    
    // Execute query
    const getProduct = await ProductModel.aggregate(aggregatePipeline);

    // Get total row count
    const totalRowCount = await ProductModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getProduct,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error, error.message || "Internal Server Error");
  }
}
