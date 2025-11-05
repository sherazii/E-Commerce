import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { couponSchema } from "@/lib/zodSchema";
import CuponModel from "@/models/Coupon.model";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const couponFormSchema = couponSchema.pick({
      code: true,
      minShoppingAmount: true,
    });

    const validate = couponFormSchema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Missing or invalid data", validate.error);
    }

    const { code, minShoppingAmount } = validate.data;

    const couponData = await CuponModel.findOne({ code }).lean();
    if (!couponData) {
      return response(false, 404, "Invalid or expired coupon");
    }

    if (new Date() > new Date(couponData.validity)) {
      return response(false, 400, "Coupon code expired");
    }

    // ✅ Fix: numeric safe comparison
    if (parseFloat(minShoppingAmount) < parseFloat(couponData.minShoppingAmount)) {
      return response(false, 400, "Insufficient shopping amount");
    }

    return response(true, 200, "Applied successfully", {
      discountPercentage: couponData.discountPercentage,
    });

  } catch (error) {
    return catchError(error);
  }
}
