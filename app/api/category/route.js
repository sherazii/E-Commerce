import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import CategoryModel from "@/models/category.model";

// Get all categories
export async function GET(request) {
  try {
     // ✅ Authentication check
        const auth = await isAuthenticated("admin");
    
        if (!auth.isAuthenticated) {
          return response(false, 403, "Unauthorised");
        }
        // ✅ Connect to DB
        await connectDB();

    const categories = await CategoryModel.find().sort({ name: 1 }).lean().exec();
    if (!categories) {
      return response(false, 404, "Categories not found");
    }

     return response(true, 200, "Fetched successfully", categories);
  } catch (error) {
    return catchError(error, error.message || "Internal Server Error");
  }
};