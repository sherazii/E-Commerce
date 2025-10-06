import { connectDB } from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";

export async function POST(request) {
  try {
    await connectDB();

    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();

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

    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already exists");
    }

    const newRegistration = new UserModel({ name, email, password });
    await newRegistration.save();

    const secretKey = process.env.SECRET_KEY;//Details needed
    if (!secretKey) throw new Error("SECRET_KEY missing in .env.local");

    const secret = new TextEncoder().encode(secretKey); 
    const token = await new SignJWT({ userId: newRegistration._id })
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const mailResult = await sendMail(
      "Email verification request from Sheraz Hashmi",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
      )
    );

    if (!mailResult.success) {
      return response(
        false,
        500,
        "Registration succeeded but failed to send verification email"
      );
    }

    return response(
      true,
      201,
      "Registration successful. Please verify your email address."
    );
  } catch (error) {
    console.error("🔥 Register API error:", error);
    return catchError(error);
  }
}
