// ✅ All Imports
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { orderFormSchema } from "@/lib/zodSchema";
import OrderModel from "@/models/OrderModel";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    const {
      formData,
      verifiedCartData,
      subtotal,
      discount,
      couponDiscount,
      finalAmount,
    } = payload;

    // ✅ Check essential data
    if (
      !formData ||
      !verifiedCartData ||
      subtotal === undefined ||
      discount === undefined ||
      finalAmount === undefined
    ) {
      return response(false, 400, "Invalid order payload received");
    }

    // ✅ Validate formData with Zod (customer / shipping/billing info only)
    const schema = orderFormSchema.pick({
      name: true,
      email: true,
      phone: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
      landmark: true,
      ordernote: true,
      isCashOnDelivery: true,
      userId: true,
    });

    const validate = schema.safeParse(formData);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields", validate.error);
    }

    const validatedOrderInfo = validate.data;

    const orderPayload = {
      ...validatedOrderInfo, 

      products: verifiedCartData, 
      subtotal,
      discount,
      couponDiscount,
      finalAmount,

      paymentMethod: validatedOrderInfo.isCashOnDelivery ? "COD" : "ONLINE",
      status: "PENDING", // default order status
    };

    // ✅ Save into MongoDB
    const savedOrder = await OrderModel.create(orderPayload);

    return response(true, 200, "Order created successfully!", {
      orderId: savedOrder._id,
    });
  } catch (error) {
    return catchError(error, error.message || "Internal Server Error");
  }
}
