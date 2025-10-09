import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();
    const cookiesStore = await cookies();
    cookiesStore.delete("access_token");

    return response(true, 200, "Logout successfull");
  } catch (error) {
    // Handle unexpected errors gracefully
    return catchError(error);
  }
}
