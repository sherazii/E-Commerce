import cloudinary from "@/lib/cloudinaryConfig";
import { connectDB } from "@/lib/databaseConnection";
import { response, catchError } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/serverHelper";
import UserModel from "@/models/User.model";

export async function PUT(request) {
  try {
    await connectDB();

    const auth = await isAuthenticated("user");
    if (!auth.isAuthenticated) {
      return response(false, 403, "Unauthorized");
    }

    const userId = auth.userId;
    if (!userId) {
      return response(false, 404, "User ID not found");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return response(false, 404, "User not found");
    }

    const formData = await request.formData();
    const file = formData.get("file");

    user.name = formData.get("name");
    user.phone = formData.get("phone");
    user.address = formData.get("address");

    let uploadedImage = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

      uploadedImage = await cloudinary.uploader.upload(base64Image, {
        upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      });

      if (user?.avatar?.public_id) {
        await cloudinary.api.delete_resources([user.avatar.public_id]);
      }

      user.avatar = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    await user.save();

    return response(true, 200, "Profile updated successfully", {
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      avatar: user.avatar,
    });

  } catch (error) {
    console.error("❌ Profile Update Error:", error);
    return catchError(error, error.message || "Internal server error");
  }
}
