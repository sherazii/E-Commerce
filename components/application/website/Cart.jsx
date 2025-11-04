"use client";
import { GiShoppingCart } from "react-icons/gi";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { Button } from "@/components/ui/button";
import { removeFromCart } from "@/store/reducer/cartSlice";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CART_CHECKOUT } from "@/routes/WebsiteRoute";
import { useEffect, useState } from "react";
import { showToast } from "@/lib/showToast";
const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  useEffect(() => {
    const cartProducts = cart.products;
    const totalAmount = cartProducts.reduce((sum, product)=> sum + (product.sellingPrice * product.qty),0).toFixed(2)
    const discount = cartProducts.reduce((sum, product)=> sum + ((product.mrp - product.sellingPrice) * product.qty),0).toFixed(2)
    const finalPrice = (totalAmount-discount).toFixed(2)
    setSubtotal(totalAmount);
    setDiscount(discount);
    setFinalPrice(finalPrice);
  },[cart])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="relative hover:scale-105">
        <GiShoppingCart
          size={25}
          className="text-gray-500 hover:text-primary cursor-pointer"
        />
        
        {cart?.count > 0 && <span className="absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1 ">{cart.count}</span>}
      </SheetTrigger>
      <SheetContent className={"md:min-w-[500px]"}>
        <SheetHeader>
          <SheetTitle className="text-2xl">My Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100vh-40px)] pb-10 pt-2">
          <div className="sm:h-[calc(100%-30%)] h-[calc(100%-40%)] overflow-auto pe-2">
            {cart?.count === 0 && (
              <>
                <div className="h-full flex justify-center items-center text-xl font-semibold">
                  Your Cart is Empty
                </div>
              </>
            )}
            {cart?.products?.map((product) => (
              <div
                className="flex justify-between items-center gap-5 mb-4 border-b pb-4 px-2"
                key={product.variantId}
              >
                <div className="flex gap-5 items-center">
                  <Image
                    src={product?.media || imgPlaceholder}
                    width={100}
                    height={100}
                    alt="product img"
                    className="w-20 h-20 rounded border"
                  />
                  <div className="">
                    <h4 className="md:text-lg mb-1 text-sm">{product.name}</h4>
                    <p className="text-gray-500 text-sm">
                      {product.size}/{product.color}
                    </p>
                  </div>
                </div>
                <div className="">
                  <button
                    type="button"
                    className={
                      "text-red-500 underline underline-offset-1 mb-2 cursor-pointer"
                    }
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: product.productId,
                          variantId: product.variantId,
                        })
                      )
                    }
                  >
                    Remove
                  </button>
                  <p className="text-[9px] sm:text-[16px]">
                    {product.qty}X{" "}
                    {product.sellingPrice.toLocaleString("en-PK", {
                      style: "currency",
                      currency: "PKR",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-auto border-t pt-5">
            <div className="border-b">

            <h2 className="flex justify-between items-center text-lg font-semibold px-3">
              <span className="">Sub Total</span>
              <span className="">{subtotal}</span>
            </h2>
            <h2 className="flex justify-between items-center text-lg font-semibold px-3">
              <span className="">Discount</span>
              <span className="">{discount}</span>
            </h2>
            </div>
            <div className="border-b py-2 px-3">
               <h2 className="flex justify-between items-center text-lg font-semibold ">
              <span className="">Final Price</span>
              <span className="">{finalPrice}</span>
            </h2>
            </div>
            <div className="flex sm:flex-row flex-col justify-between gap-3 mt-5 px-3">
              <Button
                type="button"
                variant={"outline"}
                className={"sm:w-1/4 w-full"}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={WEBSITE_CART}>View Cart</Link>
              </Button>
              {cart.count ? (
                <Button
                  type="button"
                  className={"sm:w-1/4 w-full"}
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href={WEBSITE_CART_CHECKOUT}>Check Out</Link>
                </Button>
              ) : (
                <>
                  <button
                    type="button"
                    className="border px-3 py-1 rounded-md cursor-pointer hover:bg-primary border-primary text-primary hover:text-white transition-all duration-150 shadow-xl "
                    onClick={() =>
                      showToast(
                        "error",
                        "Your Cart Is Empty Please Add Product"
                      )
                    }
                  >
                    Check Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
