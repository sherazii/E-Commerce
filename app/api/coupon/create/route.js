// ✅ All imports
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { zSchema } from "@/lib/zodSchema";
import CuponModel from "@/models/Coupon.model";
import z from "zod";

// ✅ Create Coupon API
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
    console.log(payload);
    

    //Form schema
    const schema = zSchema
      .pick({
        code: true,
        discountPercentage: true,
        minShoppingAmount: true,
        validity: true,
      })
      .extend({
        validity: z.string(), // accept date as string instead of coercing
      });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields", validate.error);
    }

    const couponData = validate.data;

    // ✅ Create Coupon (fixed create syntax)
    const newCoupon = await CuponModel.create({
      code: couponData.code,
      discountPercentage: couponData.discountPercentage,
      minShoppingAmount: couponData.minShoppingAmount,
      validity: couponData.validity,
    });

    // ✅ (No need to call save() after .create(), it already saves the doc)
    return response(true, 200, "Coupon created successfully", newCoupon);
  } catch (error) {
    console.error("[COUPON CREATE ERROR]:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
