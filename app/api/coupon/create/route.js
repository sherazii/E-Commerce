// ✅ All imports
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { couponSchema, zSchema } from "@/lib/zodSchema";
import CuponModel from "@/models/Coupon.model";
import z from "zod";

// ✅ Create Coupon API
export async function POST(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth?.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Parse request body
    const payload = await request.json();
    console.log("[COUPON PAYLOAD]:", payload);

    // ✅ Form schema
    const schema = couponSchema
      .pick({
        code: true,
        discountPercentage: true,
        minShoppingAmount: true,
        validity: true,
      })
      .extend({
        validity: z.string().min(1, "Validity date is required"),
        code: z.string().trim().toUpperCase(),
      });

    // ✅ Validate
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(
        false,
        400,
        "Invalid or missing fields",
        validate.error.message
      );
    }

    const couponData = validate.data;

    // ✅ Create Coupon
    const newCoupon = await CuponModel.create({
      code: couponData.code,
      discountPercentage: couponData.discountPercentage,
      minShoppingAmount: couponData.minShoppingAmount,
      validity: couponData.validity,
    });

    // ✅ Success response
    return response(true, 200, "Coupon created successfully", newCoupon);
  } catch (error) {
    console.error("[COUPON CREATE ERROR]:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
