import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import otpModel from "@/models/otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verifies OTP, logs user in, and sets JWT token in cookies
 * @access  Public (after OTP request)
 */
export async function POST(request) {
    
  try {
    /** 
     * 🧩 Step 1: Connect to the database
     */
    await connectDB();

    /** 
     * 🧩 Step 2: Parse and validate the request body using Zod schema
     */
    const payload = await request.json();
    const validationSchema = zSchema.pick({
      otp: true,
      email: true,
    });

    
    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input fields",
        validatedData.error
      );
    }
    const { email, otp } = validatedData.data;
    

    /** 
     * 🧩 Step 3: Verify OTP validity in the database
     * - Ensure OTP matches and has not expired
     */
    const getOtpData = await otpModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid or expired OTP");
    }

    /** 
     * 🧩 Step 4: Find user associated with the email
     */
    const getUser = await UserModel.findOne({
      email,
      deletedAt: null,
    }).lean();

    if (!getUser) {
      return response(false, 404, "User not found");
    }

    /** 
     * 🧩 Step 5: Prepare user payload for JWT
     */
    const loggedInUserData = {
      _id: getUser._id,
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };

    /** 
     * 🧩 Step 6: Generate JWT token for authenticated session
     */
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    /** 
     * 🧩 Step 7: Set JWT in secure cookie
     */
    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token", // ✅ cookie names should not contain spaces
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    /** 
     * 🧩 Step 8: Remove OTP document after successful verification
     */
    await getOtpData.deleteOne();

    /** 
     * 🧩 Step 9: Return success response
     */
    return response(true, 200, "OTP verified successfully! Login successful.", loggedInUserData);

  } catch (error) {
    /** 
     * 🔥 Step 10: Handle and return server errors gracefully
     */
    return catchError(error);
  }
}
