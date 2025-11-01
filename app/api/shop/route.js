import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import ProductModel from "@/models/product.model";

export async function GET(request) {
  try {
    // ✅ Ensure DB connection
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    // ✅ Extract filters safely
    const size = searchParams.get("size") || null;
    const color = searchParams.get("color") || null;
    const categorySlug = searchParams.get("category") || null;
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice =
      Number(searchParams.get("maxPrice")) || Number.MAX_SAFE_INTEGER;
    const search = searchParams.get("q")?.trim() || "";

    // ✅ Pagination
    const limit = Number(searchParams.get("limit")) || 9;
    const page = Number(searchParams.get("page")) || 0;
    const skip = page * limit;

    // ✅ Sorting
    const sortOption = searchParams.get("sort") || "default_sorting";
    const sortOptions = {
      default_sorting: { createdAt: -1 },
      asc: { name: 1 },
      desc: { name: -1 },
      price_low_high: { sellingPrice: 1 },
      price_high_low: { sellingPrice: -1 },
    };
    const sortQuery = sortOptions[sortOption] || sortOptions.default_sorting;

    // ✅ Find category ID (if categorySlug provided)
    let categoryId = [];
    if (categorySlug) {
      const slugs = categorySlug.split(",");
      const categoryData = await CategoryModel.find({
        slug: { $in: slugs },
        deletedAt: null,
      })
        .select("_id")
        .lean();
      categoryId = categoryData.map(category => category._id);
    }

    // ✅ Base match filters
    const matchStage = {};
    if (categoryId.length > 0) matchStage.category = {$in: categoryId};
    if (search) matchStage.name = { $regex: search, $options: "i" };

    // ✅ MongoDB aggregation
    const products = await ProductModel.aggregate([
      { $match: matchStage },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: "productvariants", // must match your actual collection name in MongoDB
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },
      {
        $addFields: {
          variants: {
            $filter: {
              input: "$variants",
              as: "variant",
              cond: {
                $and: [
                  size ? { $in: ["$$variant.size", size.split(',')] } : { $literal: true },
                  color
                    ? { $in: ["$$variant.color", color.split(',')] }
                    : { $literal: true },
                  { $gte: ["$$variant.sellingPrice", minPrice] },
                  { $lte: ["$$variant.sellingPrice", maxPrice] },
                ],
              },
            },
          },
        },
      },
      // ✅ Only include products that have at least one matching variant
      { $match: { "variants.0": { $exists: true } } },
      {
        $lookup: {
          from: "medias", // must match your actual collection name
          localField: "media",
          foreignField: "_id",
          as: "media",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          media: { _id: 1, secure_url: 1, alt: 1 },
          variants: {
            color: 1,
            size: 1,
            mrp: 1,
            sellingPrice: 1,
            discountPercentage: 1,
          },
        },
      },
    ]);

    // ✅ Handle pagination
    let nextPage = null;
    if (products.length > limit) {
      nextPage = page + 1;
      products.pop();
    }

    return response(true, 200, "Products found", { products, nextPage });
  } catch (error) {
    console.error("❌ Product GET error:", error.message, error.stack);
    return catchError(error, error.message || "Internal Server Error");
  }
}
