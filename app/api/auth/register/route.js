import { connectDB } from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";
import { response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";

export async function POST(request) {
  try {
    await connectDB();

    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json(); // ✅ FIXED

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        400,
        "Invalid or missing input field",
        validatedData.error.issues
      );
    }

    const { name, email, password } = validatedData.data;

    // ✅ FIXED: Await check
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already exists");
    }

    // New Registration
    const newRegistration = new UserModel({ name, email, password });
    await newRegistration.save();

    // Generate JWT
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newRegistration._id })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

      await sendMail("Email verification request from Sheraz Hashmi")
    return response(true, 201, "User registered successfully", { token });
  } catch (error) {
    return response(false, 500, "Server error", error.message);
  }
}
