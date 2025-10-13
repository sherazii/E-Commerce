// All imports

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import CategoryModel from "@/models/category.model";

// Adding Category
export async function POST(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");

    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorised");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Parse body
    const { name, slug } = await request.json();

    if (!name?.trim()) {
      return response(false, 400, "Category name is required");
    }
    if (!slug?.trim()) {
      return response(false, 400, "Slug is required");
    }

    // ✅ Check duplicate
    const existingSlug = await CategoryModel.findOne({ slug }).lean();
    if (existingSlug) {
      return response(false, 400, "This category already exists");
    }

    // ✅ Create category
    await Category.create({ name, slug });

    return response(true, 200, "Category created successfully");
  } catch (error) {
    console.error("[CATEGORY CREATE ERROR]:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}


// // Get category details
// export const getCategoryDetails = async (req, res, next) => {
//    try {
//     const { categoryid } = req.params;

//     const category = await Category.findById(categoryid);
//     if (!category) return next(handleError(404, "Category not found"));

//     res.status(200).json({
//       category,
//     });
//   } catch (error) {
//     next(handleError(500, "Error from category controller"));
//   }
// };
// // Delete Categories
// export const deleteCategory = async (req, res, next) => {
//   try {
//     const { categoryid } = req.params;
//     const deletedCategory = await Category.findByIdAndDelete(categoryid);

//     if (!deletedCategory) {
//       return next(handleError(404, "Category not found"));
//     }

//     res.status(200).json({
//       success: true,
//       message: "Category deleted successfully",
//     });
//   } catch (error) {
//     return next(handleError(400, error.message || "Error deleting category!"));
//   }
// };
// // Update category logic goes here
// export const updateCategory = async (req, res, next) => {
//   try {
//     const { name, slug } = req.body;
//     const { categoryid } = req.params;
//     const category = await Category.findByIdAndUpdate(
//       categoryid,
//       {
//         name,
//         slug,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Category updated",
//       category,
//     });
//   } catch (error) {
//     next(handleError(500, "Error from category controller"));
//   }
// };
