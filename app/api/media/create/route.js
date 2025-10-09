import cloudinary from "@/lib/cloudinaryConfig";
import { catchError } from "@/lib/helperFunction";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const payload = await request.json();

    return NextResponse.json({ signature });
  } catch (error) {
    return catchError(error);
  }
}
