// ✅ All imports
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

// ✅ Create Product API
export async function POST(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Parse request body
    const payload = await request.json();

    // ✅ Validate with Zod schema
    const schema = zSchema.pick({
      product: true,
      sku: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      media: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields", validate.error);
    }

    const variantData = validate.data;
    

    // ✅ Create Product (fixed create syntax)
    const newVariant = await ProductVariantModel.create({
      product: variantData.product,
      sku: variantData.sku,
      color: variantData.color,
      size: variantData.size,
      mrp: variantData.mrp,
      sellingPrice: variantData.sellingPrice,
      discountPercentage: variantData.discountPercentage,
      media: variantData.media,
    });

    // ✅ (No need to call save() after .create(), it already saves the doc)
    return response(true, 200, "Product created successfully", newVariant);
  } catch (error) {
    console.error("[PRODUCT CREATE ERROR]:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
