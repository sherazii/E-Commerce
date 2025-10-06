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

});

// Usage example:
// const parsed = Number("123456"); // convert from input first
// const result = otpNumberSchema.safeParse(parsed);
// if (!result.success) {
//   console.error(result.error.format());
// } else {
//   console.log("Valid numeric OTP:", result.data); // 123456
// }
