import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import UserModel from "@/models/User.model";

export async function GET(request) {
  try {
    await connectDB();
     // ✅ Authentication check
    const auth = await isAuthenticated("user");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    const userId = auth.userId;
    if (!userId) {
      return response(false, 404, "Userid not found");
    }
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      return response(false, 404, "User not found");
    }
    return response(true, 200, "User found", user);
  } catch (error) {}
}
