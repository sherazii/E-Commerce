"use client";
import WebsiteBreadcrumb from "@/components/application/website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { addIntoCart, clearCart } from "@/store/reducer/cartSlice";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const breadCrumb = {
  title: "Checkout",
  links: [
    {
      label: "Checkout",
    },
  ],
};
const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [verifiedCartData, setVerifiedCartData] = useState([]);
  const { data: getVerifiedCartData } = useFetch(
    "/api/cart-verification",
    "POST",
    { data: cart.products }
  );

  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = getVerifiedCartData.data;
      setVerifiedCartData(cartData);
      dispatch(clearCart());

      cartData.forEach((cartItem) => {
        dispatch(addIntoCart(cartItem));
      });
    }
  }, [getVerifiedCartData]);

  console.log(verifiedCartData);
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
          <div className="lg:w-[60%] w-full"></div>
          <div className="lg:w-[40%] w-full">
            <div className="rounded bg-gray-50 p-5 top-5 sticky">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
              <div>
                <table className="w-full border">
                  <tbody>
                    {verifiedCartData &&
                      verifiedCartData.map((product) => <tr key={product.variantId}>
                        <td className="p-3">
                          <div className="flex items-center gap-5">
                            <Image src={product.media} width={60} height={60} alt={product.name} className="rounded"/>
                            <div>
                              <h4 className="font-medium line-clamp-1"><Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link></h4>
                              <p className="text-xs">Color:{product.color}</p>
                              <p className="text-xs">Size:{product.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <p className="text-nowrap text-sm">{product.qty}X{product.sellingPrice.toLocaleString('en-PK', {style: 'currency', currency: 'PKR'})}</p>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-medium py-2 ">Sub total</td>
                      <td className="text-end py-2">100</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 ">Discount</td>
                      <td className="text-end py-2">100</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 ">Coupon Discount</td>
                      <td className="text-end py-2">100</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <hr className=" bg-gray-700" />
                      </td>
                    </tr>

                    <tr>
                      <td className="font-semibold py-2 text-2xl">Total</td>
                      <td className="text-end py-2">100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
