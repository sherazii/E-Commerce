import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    { status: statusCode } // ✅ also set actual HTTP status
  );
};

export const catchError = (error, customMessage) => {
  let statusCode = 500;
  let message = customMessage || "Internal server error";

  // ✅ Handle duplicate key error safely
  if (error.code === 11000) {
    const keys =
      (error.keyPattern && Object.keys(error.keyPattern)) ||
      (error.keyValue && Object.keys(error.keyValue)) ||
      [];

    const keysText = keys.length > 0 ? keys.join(", ") : "unknown field(s)";

    message = `Duplicate fields: ${keysText}. These values must be unique.`;
    statusCode = 409; // Conflict
  }

  // ✅ Handle validation errors
  else if (error.name === "ValidationError") {
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // ✅ Handle other known Mongoose/Mongo errors (optional)
  else if (error.name === "MongoServerError" && error.message) {
    message = error.message;
  }

  // ✅ Detailed in dev, minimal in production
  const data =
    process.env.NODE_ENV === "development"
      ? { error: error.message, stack: error.stack }
      : {};

  return response(false, statusCode, message, data);
};

export const genrateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const isAuthenticated = async (role) => {
  try {
    const cookieStore = await cookies();

    if (!cookieStore.has("access_token")) {
      return isAuthenticated(false);
    }
    const access_token = cookieStore.get("access_token");
    // 🔑 Step 3: Verify JWT using the secret key
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) throw new Error("SECRET_KEY missing in .env.local");
    const secret = new TextEncoder().encode(secretKey);

    const payload = await jwtVerify(access_token.value, secret);

    if (payload.payload.role !== role) {
      return {
        isAuthenticated: false,
      };
    }
    return {
      isAuthenticated: true,
      userId: payload.payload._id,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error,
    };
  }
};
