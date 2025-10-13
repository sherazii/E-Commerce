"use server"
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export const isAuthenticated = async (role) => {
  try {
    const cookieStore = await cookies();

    if (!cookieStore.has("access_token")) {
      return { isAuthenticated: false };
    }

    const access_token = cookieStore.get("access_token");
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) throw new Error("SECRET_KEY missing in .env.local");
    const secret = new TextEncoder().encode(secretKey);

    const payload = await jwtVerify(access_token.value, secret);

    if (payload.payload.role !== role) {
      return { isAuthenticated: false };
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
