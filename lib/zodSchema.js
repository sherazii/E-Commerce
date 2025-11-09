import { z } from "zod";

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/;

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/, "Invalid MongoDB ObjectId");

export const zSchema = z.object({
  name: z.string().min(3),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(passwordRegex),
  otp: z.coerce.string().regex(/^\d{6}$/),
  _id: z.string().min(3),
  category: z.string().min(3),
  slug: z.string().min(2),
  alt: z.string().optional(),
  mrp: z.union([
    z.number().positive(),
    z.string().transform(Number).refine((v) => !isNaN(v) && v > 0),
  ]),
  sellingPrice: z.union([
    z.number().positive(),
    z.string().transform(Number).refine((v) => !isNaN(v) && v > 0),
  ]),
  discountPercentage: z.union([
    z.number().min(0).max(100),
    z.string().transform(Number).refine((v) => !isNaN(v) && v > 0),
  ]),
  description: z.string().min(3),
  media: z.array(z.string()),
  product: z.string(),
  sku: z.string(),
  color: z.string().min(3),
  size: z.string(),
});

export const reviewSchema = z.object({
  product: objectIdSchema,
  userid: objectIdSchema,
  rating: z.preprocess((v) => Number(v), z.number().min(1).max(5)),
  title: z.string().min(3).max(100),
  review: z.string().min(10).max(1000),
});

export const couponSchema = z.object({
  _id: z.string().min(3),
  code: z.string().trim().min(3).toUpperCase(),
  discountPercentage: z.union([z.number(), z.string().transform(Number)]).refine(
    (v) => !isNaN(v),
  ),
  minShoppingAmount: z
    .union([z.number().positive(), z.string().transform(Number)])
    .refine((v) => !isNaN(v) && v > 0),
  validity: z.string().min(1),
});

export const orderFormSchema = z.object({
  name: z.string().min(3).max(50),
  address: z.string().min(3).max(50),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  isCashOnDelivery: z.literal(true),
  country: z.string().min(2),
  state: z.string().min(2),
  city: z.string().min(2),
  pincode: z.string().min(4).max(10),
  landmark: z.string().optional(),
  ordernote: z.string().optional(),
  userId: objectIdSchema.optional(),
});
