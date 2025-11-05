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

export const reviewSchema = z.object({
  product: z
    .string()
    .min(1, "Product ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),

  userid: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),

  // ✅ Accept rating as string and convert to number
  rating: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1, "Rating must be at least 1 star")
      .max(5, "Rating must be at most 5 stars")
  ),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  review: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review cannot exceed 1000 characters"),
});

export const couponSchema = z.object({
  _id: z.string().min(3, "_id is required"),
  code: z.string().trim().min(3, "Code is required").toUpperCase(),
  discountPercentage: z
    .union([
      z.number().min(0).max(100),
      z.string().transform((val) => Number(val)),
    ])
    .refine((val) => !isNaN(val), "Invalid discount value"),
  minShoppingAmount: z
    .union([z.number().positive(), z.string().transform((val) => Number(val))])
    .refine((val) => !isNaN(val) && val > 0, "Invalid shopping amount"),
  validity: z.string().min(1, "Validity is required"), // accept string date
});

export const orderFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z.string().email("Invalid email format"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone cannot exceed 15 digits"),

  country: z.string().min(2, "Country is required"),

  state: z.string().min(2, "State is required"),

  city: z.string().min(2, "City is required"),

  pincode: z
    .string()
    .min(4, "Pincode must be at least 4 characters")
    .max(10, "Pincode cannot exceed 10 characters"),

  landmark: z.string().optional(),

  ordernote: z.string().optional(),
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),
});
