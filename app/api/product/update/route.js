// All imports

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/product.model";

// Adding Product
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
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      media: true,
    });

    const validateData = schema.safeParse(payload);
    if (!validateData.success) {
      return response(false, 404, "This product not found");
    }

    const {
      _id,
      name,
      slug,
      mrp,
      sellingPrice,
      discountPercentage,
      description,
      media,
    } = validateData.data;

    // ✅ Check duplicate
    const getProduct = await ProductModel.findOne({
      deletedAt: null,
      _id,
    });
    if (!getProduct) {
      return response(false, 404, "This product not found");
    }
    // ✅ Create product
    getProduct.name = name;
    getProduct.slug = slug;
    getProduct.mrp = mrp;
    getProduct.sellingPrice = sellingPrice;
    getProduct.discountPercentage = discountPercentage;
    getProduct.description = description;
    getProduct.media = media;
    await getProduct.save();

    return response(true, 200, "Product updated successfully");
  } catch (error) {
    console.error("[PRODUCT CREATE ERROR]:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}

// // Get product details
// export const getCategoryDetails = async (req, res, next) => {
//    try {
//     const { categoryid } = req.params;

//     const product = await Product.findById(categoryid);
//     if (!product) return next(handleError(404, "Product not found"));

//     res.status(200).json({
//       product,
//     });
//   } catch (error) {
//     next(handleError(500, "Error from product controller"));
//   }
// };
// // Delete Categories
// export const deleteCategory = async (req, res, next) => {
//   try {
//     const { categoryid } = req.params;
//     const deletedCategory = await Product.findByIdAndDelete(categoryid);

//     if (!deletedCategory) {
//       return next(handleError(404, "Product not found"));
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product deleted successfully",
//     });
//   } catch (error) {
//     return next(handleError(400, error.message || "Error deleting product!"));
//   }
// };
// // Update product logic goes here
// export const updateCategory = async (req, res, next) => {
//   try {
//     const { name, slug } = req.body;
//     const { categoryid } = req.params;
//     const product = await Product.findByIdAndUpdate(
//       categoryid,
//       {
//         name,
//         slug,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Product updated",
//       product,
//     });
//   } catch (error) {
//     next(handleError(500, "Error from product controller"));
//   }
// };
