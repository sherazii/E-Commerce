// ✅ All imports
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/product.model";

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
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      media: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields", validate.error);
    }

    const productData = validate.data;

    // ✅ Create Product (fixed create syntax)
    const newProduct = await ProductModel.create({
      name: productData.name,
      slug: productData.slug,
      category: productData.category,
      mrp: productData.mrp,
      sellingPrice: productData.sellingPrice,
      discountPercentage: productData.discountPercentage,
      description: productData.description,
      media: productData.media,
    });

    // ✅ (No need to call save() after .create(), it already saves the doc)
    return response(true, 200, "Product created successfully", newProduct);
  } catch (error) {
    console.error("[PRODUCT CREATE ERROR]:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
