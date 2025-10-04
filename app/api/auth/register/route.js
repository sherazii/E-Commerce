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

    // Check if user exists
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already exists");
    }

    // New Registration
    const newRegistration = new UserModel({ name, email, password });
    await newRegistration.save();

    // Generate verification token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newRegistration._id })
      .setIssuedAt()
      .setExpirationTime("24h") // ✅ allow more time to verify
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // Send verification email
    const mailResult = await sendMail(
      "Email verification request from Sheraz Hashmi",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`
      )
    );

    if (!mailResult.success) {
      return response(false, 500, "Registration succeeded but failed to send verification email");
    }

    return response(
      true,
      201,
      "Registration successful. Please verify your email address."
    );
  } catch (error) {
    return catchError(error); // ✅ must return
  }
}
