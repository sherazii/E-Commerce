import { connectDB } from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";
import { NextResponse } from "next/server";
import { response } from "./../../../../lib/helperFunction";
import UserModel from "@/models/User.model";

export async function POST(request) {
  try {
    await connectDB();
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });
    const payload = request.json();

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field",
        validatedData.error
      );
    }

    const { name, email, password } = validatedData.data;

    // Checking does user already register
    const checkUser = UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User Already exist", validatedData.error);
    }
    //New Registration
    const newRegistration = new UserModel({
      name,
      email,
      password,
    });
    await newRegistration.save();
  } catch (error) {}
}
