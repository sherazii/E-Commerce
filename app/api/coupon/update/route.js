// ✅ All imports
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import { couponSchema } from "@/lib/zodSchema";
import CuponModel from "@/models/Coupon.model";
import { z } from "zod";

// ✅ Update Coupon API
export async function PUT(request) {
  try {
    // ✅ Authentication check
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Parse body
    const payload = await request.json();
    console.log(payload);
    

    // ✅ Validation schema
    const schema = couponSchema
      .pick({
        _id: true,
        code: true,
        discountPercentage: true,
        minShoppingAmount: true,
        validity: true,
      })
      .extend({
        validity: z.string().min(1, "Validity date is required"),
        code: z.string().trim().toUpperCase(),
      });

    const validateData = schema.safeParse(payload);
    if (!validateData.success) {
      return response(
        false,
        400,
        "Invalid or missing fields",
        validateData.error.flatten()
      );
    }

    const { _id, code, discountPercentage, minShoppingAmount, validity } =
      validateData.data;

    // ✅ Check if coupon exists
    const getCoupon = await CuponModel.findOne({
      _id,
      deletedAt: null,
    });
    if (!getCoupon) {
      return response(false, 404, "Coupon not found");
    }

    // ✅ Optional: check for duplicate code
    const existingCode = await CuponModel.findOne({
      _id: { $ne: _id },
      code,
      deletedAt: null,
    });
    if (existingCode) {
      return response(false, 400, "Coupon code already exists");
    }

    // ✅ Update coupon
    getCoupon.code = code;
    getCoupon.discountPercentage = discountPercentage;
    getCoupon.minShoppingAmount = minShoppingAmount;
    getCoupon.validity = validity;
    await getCoupon.save();

    // ✅ Success response
    return response(true, 200, "Coupon updated successfully", getCoupon);
  } catch (error) {
    console.error("[COUPON UPDATE ERROR]:", error);
    return catchError(error, error.message || "Internal Server Error");
  }
}
