import { connectDB } from "@/lib/databaseConnection";
import { catchError,  response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import MediaModel from "@/models/media.model";
import { get, isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
    
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuthenticated) {
            return response(false, 403, "Unauthorized");
        }
        
        await connectDB();
        
        const getParams = await params;
        const id = getParams.id;
        
        const filter = {
            deletedAt: null,
        };
        if (!isValidObjectId(id)) {
            return response(false, 400, "Invalid Onject id");
        }
        
        filter._id = id;
        const getMedia = await MediaModel.findOne(filter).lean();
        
        if (!getMedia) {
            return response(false, 404, "No Media found");
        }
    return response(true, 200, "Media found", getMedia);
  } catch (error) {
    return catchError(error);
  }
}
