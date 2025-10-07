import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(request) {
  try {
    await connectDB();

    const payload = await request.json();
    const validationSchema = zSchema.pick({
      email: true,
      password: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 401, "Missing input field", validatedData.error);
    }

    const { email, password } = validatedData.data;

    if (password.length < 6) {
      return response(false, 400, "Password must be at least 6 characters long");
    }

    const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password");

    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // ✅ Update password (will trigger pre-save hook)
    getUser.password = password;
    await getUser.save();

    return response(true, 200, "Password updated successfully");

  } catch (error) {
    console.error("Password update error:", error);
    return catchError(error);
  }
}
