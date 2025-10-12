import { z } from "zod";

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/;

export const zSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password is too long" })
    .regex(passwordRegex, {
      message:
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
  otp: z.coerce.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),

  // ✅ New fields added
  _id: z
    .string()
    .regex(/^[a-f\d]{24}$/, { message: "Invalid MongoDB ObjectId" }),

  alt: z.string().optional(),
  title: z.string().optional(),
});
