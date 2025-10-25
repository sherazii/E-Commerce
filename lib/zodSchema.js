import { z } from "zod";

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/;

// ✅ Reusable Mongo ObjectId Schema
const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/, { message: "Invalid MongoDB ObjectId" });

// ✅ Main Zod Schema
export const zSchema = z.object({
  // 🔹 Authentication Fields
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

  // 🔹 Database Identifiers
  _id: z.string().min(3, "_id is required"),
  category: z.string().min(3, "Category is required"), // assuming this is required

  // 🔹 Basic Product Info
  name: z.string().min(3, "name is required"),
  slug: z.string().min(2, "Too short"),
  alt: z.string().optional(),

  // 🔹 Pricing Details
  mrp: z.union([
    z.number().positive({ message: "MRP must be a positive number" }),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "Please enter a valid number"),
  ]),
  sellingPrice: z.union([
    z.number().positive({ message: "MRP must be a positive number" }),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "Please enter a valid number"),
  ]),
  discountPercentage: z.union([
    z.number().min(0).max(100, "Value must be between 0 to 100"),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "Please enter a valid number"),
  ]),

  // 🔹 Media & Description
  description: z.string().min(3, "Description is required "),
  media: z.array(z.string()),
  product: z.string(),
  sku: z.string(),
  color: z
    .string()
    .min(3, { message: "Color must be at least 3 characters long" }),
  size: z.string(),
});



export const couponSchema = z.object({
  code: z.string().trim().min(3, "Code is required").toUpperCase(),
  discountPercentage: z
    .union([
      z.number().min(0).max(100),
      z.string().transform((val) => Number(val)),
    ])
    .refine((val) => !isNaN(val), "Invalid discount value"),
  minShoppingAmount: z
    .union([
      z.number().positive(),
      z.string().transform((val) => Number(val)),
    ])
    .refine((val) => !isNaN(val) && val > 0, "Invalid shopping amount"),
  validity: z.string().min(1, "Validity is required"), // accept string date
});
