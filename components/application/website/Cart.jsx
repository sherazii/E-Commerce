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
import { useState } from "react";
import { showToast } from "@/lib/showToast";
const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <GiShoppingCart
          size={25}
          className="text-gray-500 hover:text-primary cursor-pointer"
        />
      </SheetTrigger>
      <SheetContent className={"md:min-w-[500px]"}>
        <SheetHeader>
          <SheetTitle className="text-2xl">My Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100vh-40px)] pb-10 pt-2">
          <div className="h-[calc(100%-128px)] overflow-auto pe-2">
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
                    <h4 className="text-lg mb-1">{product.name}</h4>
                    <p className="text-gray-500">
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
                  <p className="text-sm ">
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
          <div className="h-32 border-t pt-5 px-3">
            <h2 className="flex justify-between items-center text-lg font-semibold">
              <span className="">Sub Total</span>
              <span className="">0</span>
            </h2>
            <h2 className="flex justify-between items-center text-lg font-semibold">
              <span className="">Discount</span>
              <span className="">0</span>
            </h2>
            <div className="flex justify-between gap-10 mt-5 ">
              <Button
                type="button"
                variant={"outline"}
                className={"w-1/4"}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={WEBSITE_CART}>View Cart</Link>
              </Button>
              {cart.count ? (
                <Button
                  type="button"
                  className={"w-1/4"}
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
