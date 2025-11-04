"use client";
import WebsiteBreadcrumb from "@/components/application/website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  WEBSITE_CART_CHECKOUT,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import imagePlaceholder from "@/public/assets/images/img-placeholder.webp";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "@/store/reducer/cartSlice";
const breadCrumb = {
  title: "Cart",
  links: [
    {
      label: "Cart",
    },
  ],
};
const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  useEffect(() => {
    const cartProducts = cart.products;
    const totalAmount = cartProducts
      .reduce((sum, product) => sum + product.sellingPrice * product.qty, 0)
      .toFixed(2);
    const discount = cartProducts
      .reduce(
        (sum, product) =>
          sum + (product.mrp - product.sellingPrice) * product.qty,
        0
      )
      .toFixed(2);
    const finalPrice = (totalAmount - discount).toFixed(2);
    setSubtotal(totalAmount);
    setDiscount(discount);
    setFinalPrice(finalPrice);
  }, [cart]);


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
              <Link href={WEBSITE_SHOP}>Contineu Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-10 my-20 lg:px-32 px-4">
          <div className="lg:w-[70%] w-full">
            <table className="w-full border">
              <thead className="border-b bg-gray-50 md:table-header-group hidden">
                <tr>
                  <th className="text-start p-3">Product</th>
                  <th className="text-center p-3">Price</th>
                  <th className="text-center p-3">Quantity</th>
                  <th className="text-center p-3">Total</th>
                  <th className="text-center p-3">action</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map((product) => (
                  <tr
                    key={product.variantId}
                    className="border-b md:table-row flex flex-col md:flex-row md:items-center gap-3 p-3"
                  >
                    {/* PRODUCT COLUMN */}
                    <td className="flex flex-row items-start md:items-center gap-4 m-3">
                      <Image
                        src={product.media || imagePlaceholder}
                        width={60}
                        height={60}
                        alt={product.name}
                      />
                      <div>
                        <h4 className="text-lg font-medium line-clamp-1">
                          <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>
                            {product.name}
                          </Link>
                        </h4>
                        <p className="text-sm">Color: {product.color}</p>
                        <p className="text-sm">Size: {product.size}</p>
                      </div>
                    </td>

                    {/* PRICE COLUMN */}
                    <td className="md:table-cell flex justify-between md:justify-center md:p-3 text-sm font-medium text-gray-700">
                      <span className="md:hidden font-semibold">Price:</span>
                      {product.sellingPrice.toLocaleString("en-PK", {
                        style: "currency",
                        currency: "PKR",
                      })}
                    </td>

                    {/* QTY COLUMN */}
                    <td className="md:table-cell flex justify-between md:justify-center md:p-3 items-center">
                      <span className="md:hidden font-semibold">Qty:</span>
                      <div className="flex items-center sm:h-10 justify-center border rounded-full">
                        <button
                          type="button"
                          className="h-full w-10 flex justify-center items-center cursor-pointer "
                          onClick={() => dispatch(decreaseQuantity({
                              productId: product.productId,
                              variantId: product.variantId,
                            }))}
                        >
                          <HiMinus />
                        </button>

                        <input
                          type="text"
                          value={product.qty}
                          className="sm:w-14 w-6 text-center border-none outline-offset-0"
                          readOnly
                        />

                        <button
                          type="button"
                          className="h-full w-10 flex justify-center items-center cursor-pointer"
                          onClick={() => dispatch(increaseQuantity({
                              productId: product.productId,
                              variantId: product.variantId,
                            }))}
                        >
                          <HiPlus />
                        </button>
                      </div>
                    </td>

                    {/* TOTAL PRICE COLUMN */}
                    <td className="md:table-cell flex justify-between md:justify-center md:p-3 text-sm font-medium text-gray-700">
                      <span className="md:hidden font-semibold">Total: </span>
                      {(product.sellingPrice * product.qty).toLocaleString(
                        "en-PK",
                        {
                          style: "currency",
                          currency: "PKR",
                        }
                      )}
                    </td>

                    {/* DELETE BUTTON */}
                    <td className="md:table-cell flex justify-between md:justify-center md:p-3 items-center">
                      <span className="md:hidden font-semibold">Remove:</span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: product.productId,
                              variantId: product.variantId,
                            })
                          )
                        }
                        className="text-red-500 text-3xl cursor-pointer"
                      >
                        <IoIosCloseCircleOutline />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:w-[30%] w-full">
            <div className="rounded bg-gray-50 p-5 top-5 sticky">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-medium py-2 ">Sub total</td>
                      <td className="text-end py-2 ">{subtotal.toLocaleString('en-PK', {style: 'currency', currency: 'PKR'})}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 ">Discount</td>
                      <td className="text-end py-2 ">{discount.toLocaleString('en-PK', {style: 'currency', currency: 'PKR'})}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <hr className=" bg-gray-700" />
                      </td>
                    </tr>

                    <tr>
                      <td className="font-medium py-2 ">Total</td>
                      <td className="text-end py-2 ">{finalPrice.toLocaleString('en-PK', {style: 'currency', currency: 'PKR'})}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="w-full py-5 flex flex-col items-center justify-center gap-5 mt-10">
                  <Button asChild className={"w-48 bg-black text-white"}>
                    <Link href={WEBSITE_CART_CHECKOUT}>
                      Proceed to Checkout
                    </Link>
                  </Button>
                  <p className="text-center">
                    <Link
                      href={WEBSITE_SHOP}
                      className="hover:border-2 p-3 rounded-2xl"
                    >
                      Contineu Shopping
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
