// All imports

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/category.model";

// Adding Category
export async function PUT(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");

    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorised");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Parse body
    const payload = await request.json();
    const schema = zSchema.pick({
      _id: true,
      name: true,
      slug: true,
    });

    const validateData = schema.safeParse(payload);
    if (!validateData.success) {
      return response(false, 404, "This category not found");
    }

    const { _id, name, slug } = validateData.data;
    

    // ✅ Check duplicate
    const getCategory = await CategoryModel.findOne({
      deletedAt: null,
      _id,
    });
    if (!getCategory) {
      return response(false, 404, "This category not found");
    }
    // ✅ Create category
    getCategory.name = name;
    getCategory.slug = slug;
    await getCategory.save();

    return response(true, 200, "Category updated successfully");
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
