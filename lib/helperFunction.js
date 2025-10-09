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

  // Handle duplicate key error
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(", ");
    message = `Duplicate fields: ${keys}. These values must be unique.`;
    statusCode = 409; // Conflict
  }

  // If it's a validation error
  if (error.name === "ValidationError") {
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Detailed error in dev, safe error in prod
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
    const payload = await jwtVerify(
      access_token.value,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    if (payload.role !== role) {
      return {
        isAuthenticated: false,
      };
    }
    return {
      isAuthenticated: true,
      userId: payload._id
    };
  } catch (error) {
     return {
      isAuthenticated: false,
      error
    };
  }
};
