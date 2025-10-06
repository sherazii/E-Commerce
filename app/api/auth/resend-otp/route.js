import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, genrateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import otpModel from "@/models/otp.model";
import UserModel from "@/models/User.model";

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Regenerates and sends a new OTP to user's email
 * @access  Public
 */
export async function POST(request) {
  try {
    /** 
     * 🧩 Step 1: Connect to the database
     */
    await connectDB();

    /** 
     * 🧩 Step 2: Parse and validate input
     */
    const payload = await request.json();
    const validationSchema = zSchema.pick({ email: true });
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field(s)",
        validatedData.error
      );
    }

    const { email } = validatedData.data;

    /** 
     * 🧩 Step 3: Check if user exists
     */
    const getUser = await UserModel.findOne({ email, deletedAt: null });
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    /** 
     * 🧩 Step 4: Remove any previous OTPs for the same email
     */
    await otpModel.deleteMany({ email });

    /** 
     * 🧩 Step 5: Generate a new 6-digit OTP and store it
     */
    const otp = genrateOTP(); // should return a string or number (e.g., "123456")

    const newOtpData = new otpModel({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
    });

    await newOtpData.save();

    /** 
     * 🧩 Step 6: Send OTP to user via email
     */
    const otpSendStatus = await sendMail(
      "Your Login Verification Code",
      email,
      otpEmail(otp)
    );

    if (!otpSendStatus) {
      return response(false, 400, "Failed to resend OTP. Please try again.");
    }

    /** 
     * 🧩 Step 7: Return success response
     */
    return response(true, 200, "OTP sent successfully to your email.");

  } catch (error) {
    /** 
     * 🔥 Step 8: Handle errors gracefully
     */
    return catchError(error);
  }
}
