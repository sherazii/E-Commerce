// All imports

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

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
    // ✅ Validate with Zod schema
    const schema = zSchema.pick({
      _id: true,
      product: true,
      sku: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      media: true,
    });

    const validateData = schema.safeParse(payload);
    if (!validateData.success) {
      return response(false, 404, "This product not found");
    }

    const {
      _id,
      product,
      sku,
      color,
      size,
      mrp,
      sellingPrice,
      discountPercentage,
      media,
    } = validateData.data;

    // ✅ Check duplicate
    const getProduct = await ProductVariantModel.findOne({
      deletedAt: null,
      _id,
    });
    if (!getProduct) {
      return response(false, 404, "This product not found");
    }
    // ✅ Create product
getProduct._id = _id
getProduct.product = product
getProduct.sku = sku
getProduct.color = color
getProduct.size = size
getProduct.mrp = mrp
getProduct.sellingPrice = sellingPrice
getProduct.discountPercentage = discountPercentage
getProduct.media = media
    await getProduct.save();

    return response(true, 200, "Product variant updated successfully");
  } catch (error) {
    console.error("[PRODUCT CREATE ERROR]:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
