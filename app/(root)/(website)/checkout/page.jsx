"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import WebsiteBreadcrumb from "@/components/application/website/WebsiteBreadcrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { couponSchema, orderFormSchema } from "@/lib/zodSchema";
import { showToast } from "@/lib/showToast";
import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { addIntoCart, clearCart } from "@/store/reducer/cartSlice";
import useFetch from "@/hooks/useFetch";
import { IoCloseCircle } from "react-icons/io5";
import z from "zod";
import { FaShippingFast } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";

const breadCrumb = {
  title: "Checkout",
  links: [{ label: "Checkout" }],
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  const [verifiedCartData, setVerifiedCartData] = useState([]);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  /** ---------------- CART VERIFICATION ---------------- **/
  const { data: getVerifiedCartData } = useFetch(
    "/api/cart-verification",
    "POST",
    { data: cart.products }
  );

  useEffect(() => {
    if (getVerifiedCartData?.success) {
      const cartData = getVerifiedCartData.data;
      setVerifiedCartData(cartData);

      dispatch(clearCart());
      cartData.forEach((cartItem) => dispatch(addIntoCart(cartItem)));
    }
  }, [getVerifiedCartData]);

  /** ---------------- COUPON FORM ---------------- **/
  const couponFormSchema = couponSchema.pick({
    code: true,
    minShoppingAmount: true,
  });

  const couponForm = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      minShoppingAmount: subtotal,
    },
  });

  /** ---------------- CART PRICE CALCULATION ---------------- **/
  useEffect(() => {
    const cartProducts = cart.products;

    const subTotalAmount = Number(
      cartProducts.reduce((sum, p) => sum + p.sellingPrice * p.qty, 0)
    );

    const discountAmount = Number(
      cartProducts.reduce((sum, p) => sum + (p.mrp - p.sellingPrice) * p.qty, 0)
    );

    setSubtotal(subTotalAmount);
    setDiscount(discountAmount);

    // Final amount without coupon
    setFinalAmount(subTotalAmount - discountAmount);

    couponForm.setValue("minShoppingAmount", subTotalAmount);
  }, [cart]);

  /** ---------------- APPLY COUPON ---------------- **/
  const applyCoupon = async (values) => {
    setCouponLoading(true);

    try {
      const { data: response } = await axios.post("/api/coupon/apply", values);

      if (!response.success) throw new Error(response.message);

      const discountPercentage = response.data.discountPercentage;

      const calculatedCoupon = (subtotal * discountPercentage) / 100;

      setCouponDiscount(calculatedCoupon);

      // ✅ Final Amount = subtotal - product discount - coupon discount
      setFinalAmount(subtotal - discount - calculatedCoupon);

      showToast("success", response.message);
      setCouponCode(couponForm.getValues("code"));
      setIsCouponApplied(true);
      couponForm.resetField("code", "");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setIsCouponApplied(false);
    setCouponCode("");
    setCouponDiscount(0);
    setFinalAmount(subtotal - discount);
  };

  // console.log(couponForm.formState.errors);

  // ✅ Extend base schema with userId
  const orderSchema = orderFormSchema
    .pick({
      name: true,
      email: true,
      phone: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
      landmark: true,
      ordernote: true,
    })
    .extend({
      userId: z.string().optional(),
    });

  const orderForm = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      landmark: "",
      ordernote: "",
      userId: auth?.auth?._id ?? "", // Use nullish coalescing operator
    },
  });

  const onPlaceOrder = async (formData) => {
    setPlacingOrder(true);
    try {
      console.log(formData);
      orderForm.reset();
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setPlacingOrder(false);
    }
  };
  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumb} />

      {cart.count === 0 ? (
        <div className="w-screen h-1/2 flex items-center justify-center py-32">
          <div className="text-center">
            <h4 className="sm:text-4xl text-2xl font-semibold mb-5">
              Your cart is empty
            </h4>
            <Button asChild>
              <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-10 my-20 lg:px-32 px-4">
          {/* Left area for checkout form (future) */}
          <div className="lg:w-[60%] w-full">
            <div className="flex font-semibold gap-2 items-center mb-5">
              <FaShippingFast size={25} /> Shipping Address:
            </div>
            <div className="">
              <Form {...orderForm}>
                <form
                  className="grid grid-cols-2 gap-5"
                  onSubmit={orderForm.handleSubmit(onPlaceOrder)}
                >
                  {/* Name */}
                  <FormField
                    control={orderForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Name*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={orderForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Email*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={orderForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Phone*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Country */}
                  <FormField
                    control={orderForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Country*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* State */}
                  <FormField
                    control={orderForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="State*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* City */}
                  <FormField
                    control={orderForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="City*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pincode */}
                  <FormField
                    control={orderForm.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Pincode*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Landmark */}
                  <FormField
                    control={orderForm.control}
                    name="landmark"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Landmark (Optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Order Note (Textarea) */}
                  <FormField
                    control={orderForm.control}
                    name="ordernote"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Textarea
                            placeholder="Enter Order Note (Optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mb-3">
                    <ButtonLoading
                      type={"submit"}
                      text="Place Order"
                      className="bg-gray-700 rounded-full cursor-pointer hover:bg-black"
                      loading={placingOrder}
                    />
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* RIGHT SECTION — Order Summary */}
          <div className="lg:w-[40%] w-full">
            <div className="rounded bg-gray-50 p-5 sticky top-5">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>

              {/* PRODUCT LIST */}
              <table className="w-full border">
                <tbody>
                  {verifiedCartData?.map((product) => (
                    <tr key={product.variantId}>
                      <td className="p-3">
                        <div className="flex items-center gap-5">
                          <Image
                            src={product.media}
                            width={60}
                            height={60}
                            alt={product.name}
                            className="rounded"
                          />
                          <div>
                            <h4 className="font-medium line-clamp-1">
                              <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>
                                {product.name}
                              </Link>
                            </h4>
                            <p className="text-xs">Color: {product.color}</p>
                            <p className="text-xs">Size: {product.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center text-sm whitespace-nowrap">
                        {product.qty} ×{" "}
                        {product.sellingPrice.toLocaleString("en-PK", {
                          style: "currency",
                          currency: "PKR",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PRICE SUMMARY */}
              <table className="w-full mt-3">
                <tbody>
                  <tr>
                    <td className="font-medium py-2">Sub Total</td>
                    <td className="text-end">
                      {subtotal.toLocaleString("en-PK", {
                        style: "currency",
                        currency: "PKR",
                      })}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-medium py-2">Product Discount</td>
                    <td className="text-end text-red-500">
                      -{" "}
                      {discount.toLocaleString("en-PK", {
                        style: "currency",
                        currency: "PKR",
                      })}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-medium py-2">Coupon Discount</td>
                    <td className="text-end text-green-600">
                      -{" "}
                      {couponDiscount.toLocaleString("en-PK", {
                        style: "currency",
                        currency: "PKR",
                      })}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={2}>
                      <hr className="bg-gray-700 my-2" />
                    </td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-2xl py-2">Total</td>
                    <td className="text-end">
                      {finalAmount.toLocaleString("en-PK", {
                        style: "currency",
                        currency: "PKR",
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* APPLY COUPON */}
              <div className="mt-2 mb-5">
                {!isCouponApplied ? (
                  <Form {...couponForm}>
                    <form
                      className="flex justify-between gap-5"
                      onSubmit={couponForm.handleSubmit(applyCoupon)}
                    >
                      <div className="w-[calc(100%-100px)]">
                        <FormField
                          control={couponForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Enter coupon code"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-[100px]">
                        <ButtonLoading
                          type="submit"
                          text="Apply"
                          loading={couponLoading}
                          className="w-full cursor-pointer"
                        />
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="flex justify-between py-1 px-5 rounded-lg bg-gray-200">
                    <div className="">
                      <span className="text-xs">Coupon:</span>
                      <p className="text-sm font-semibold">{couponCode}</p>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 cursor-pointer"
                      onClick={removeCoupon}
                    >
                      <IoCloseCircle />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
