import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, genrateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import otpModel from "@/models/otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse incoming request data
    const payload = await request.json();

    // Validate required fields: email + password
    const validationSchema = zSchema
      .pick({ email: true })
      .extend({ password: z.string() });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input fields.",
        validatedData.error
      );
    }

    const { email, password } = validatedData.data;

    // Find user by email
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );
    if (!getUser) {
      return response(false, 404, "Invalid login credentials");
    }

    // Check if user's email is verified
    if (!getUser.isEmailVerified) {
      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) throw new Error("SECRET_KEY is missing in .env.local");

      // Generate email verification token
      const secret = new TextEncoder().encode(secretKey);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("24h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      // Send verification link via email
      await sendMail(
        "Email verification request from Sheraz Hashmi",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );

      return response(
        false,
        400,
        "Your email is not verified. A verification email has been sent to your inbox."
      );
    }
    // Verify password
    const isPasswordVerified = await getUser.comparePassword(password);
    if (!getUser?.password) {
      return response(false, 500, "Password not found for this user");
    }
    if (!getUser?.password) {
      return response(false, 500, "Password not found for this user");
    }
    if (!isPasswordVerified) {
      return response(false, 400, "Invalid login credentials");
    }

    // Generate new OTP (delete old ones first)
    await otpModel.deleteMany({ email });
    const otp = genrateOTP();

    // Save OTP to database
    await new otpModel({ email, otp }).save();

    // Send OTP via email
    const otpEmailStatus = await sendMail(
      "Your login verification code",
      email,
      otpEmail(otp)
    );

    if (!otpEmailStatus) {
      return response(false, 400, "Failed to send OTP");
    }

    // Success: OTP sent to user's email
    return response(
      true,
      200,
      "Please verify your device using the OTP sent to your email."
    );
  } catch (error) {
    // Handle unexpected errors gracefully
    return catchError(error);
  }
}
