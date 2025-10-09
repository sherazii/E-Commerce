import cloudinary from "@/lib/cloudinaryConfig";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = request.json();
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorised");
    }
    await connectDB();
    const newMedia = await MediaModel.insertMany(payload);
    return response(true, 200, "Media uploaded successfully");
  } catch (error) {
    if(payload && payload.length >  0 ){
        const publicIds = payload.map(data => data.public_id)
        try {
            await cloudinary.api.delete_resources(publicIds)
        } catch (deleteError) {
            error.cloudinary = deleteError
        }
    }
    return catchError(error);
  }
}
