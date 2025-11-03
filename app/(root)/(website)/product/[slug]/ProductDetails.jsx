"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  WEBSITE_CART,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { IoStar } from "react-icons/io5";
import { decode, encode } from "entities";
import { HiMinus, HiPlus } from "react-icons/hi2";
import ButtonLoading from "@/components/application/ButtonLoading";
import { useDispatch, useSelector } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartSlice";
import { showToast } from "@/lib/showToast";
import { Button } from "@/components/ui/button";
import loadingSvg from "@/public/assets/images/loading.svg";
import ProductReview from "@/components/application/website/ProductReview";

const ProductDetails = ({ product, variant, colors, sizes, reviewCount }) => {
  const [activeThumb, setActiveThumb] = useState();
  const [addedIntoCart, setAddedIntoCart] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [qty, setQty] = useState(1);

  useEffect(() => {
    setActiveThumb(variant?.media[0]?.secure_url);
  }, [variant]);

  /**
   * ✅ Fix: Check variant existence correctly using !== -1
   */
  useEffect(() => {
    if (cart.count > 0) {
      const existingProduct = cart.products.findIndex(
        (cartProduct) =>
          cartProduct.productId === product._id &&
          cartProduct.variantId === variant._id
      );

      setAddedIntoCart(existingProduct !== -1);
    } else {
      setAddedIntoCart(false);
    }

    setIsProductLoading(false);
  }, [variant, cart, product._id]);

  const handleThumb = (thumbUrl) => {
    setActiveThumb(thumbUrl);
  };

  const handleQty = (actionType) => {
    if (actionType === "inc") {
      setQty((prev) => prev + 1);
    } else {
      if (qty !== 1) {
        setQty((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
    const cartProduct = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      url: product.slug,
      size: variant.size,
      color: variant.color,
      mrp: variant.mrp,
      sellingPrice: variant.sellingPrice,
      media: variant?.media[0]?.secure_url,
      qty: qty,
    };

    dispatch(addIntoCart(cartProduct));
    setAddedIntoCart(true);
    showToast("success", "Product added into cart.");
  };

  return (
    <div className="lg:px-32 px-4">
      {isProductLoading && (
        <>
          <div className="fixed top-30 left-1/2 -translate-x-1/2 z-50">
            <Image src={loadingSvg} width={80} alt="loading" height={80} />
          </div>
        </>
      )}

      <div className="my-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={WEBSITE_SHOP}>Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={WEBSITE_PRODUCT_DETAILS(product?.slug)}>
                  {product?.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
        {/* Images */}
        <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0">
          <div className="xl:order-last xl:mb-0 xl:w-[calc(100%-144px)]">
            <Image
              src={activeThumb || imgPlaceholder}
              width={650}
              height={650}
              alt="product"
              className="border rounded max-w-full"
            />
          </div>

          <div className="flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-[600px]">
            {variant?.media?.map((thumb) => (
              <Image
                key={thumb._id}
                src={thumb?.secure_url || imgPlaceholder}
                width={100}
                height={100}
                alt="product thumbnail"
                className={`md:max-w-full max-w-16 rounded cursor-pointer ${
                  thumb.secure_url === activeThumb
                    ? "border-2 border-primary"
                    : "border"
                }`}
                onClick={() => handleThumb(thumb.secure_url)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 md:mt-0 mt-5">
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>

          <div className="flex items-center gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar key={i} />
            ))}
            <span className="text-sm ps-2">({reviewCount} Reviews)</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-semibold">
              {variant.sellingPrice.toLocaleString("en-PK", {
                style: "currency",
                currency: "PKR",
              })}
            </span>
            <span className="text-sm line-through text-gray-400">
              {variant.mrp.toLocaleString("en-PK", {
                style: "currency",
                currency: "PKR",
              })}
            </span>
            <span className="bg-red-500 rounded-2xl px-3 py-1 text-white ml-5 text-xs">
              -{variant.discountPercentage}%
            </span>
          </div>

          <div
            className="line-clamp-3"
            dangerouslySetInnerHTML={{ __html: decode(product.description) }}
          />

          {/* Color options */}
          <div className="mt-5">
            <p className="mb-2 font-semibold">Color: {variant.color}</p>

            <div className="flex gap-5">
              {colors.map((color) => (
                <Link
                  onClick={() => setIsProductLoading(true)}
                  href={`${WEBSITE_PRODUCT_DETAILS(
                    product.slug
                  )}?color=${color}&size=${variant.size}`}
                  key={color}
                  className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${
                    color === variant.color ? "bg-primary text-white" : ""
                  }`}
                >
                  {color}
                </Link>
              ))}
            </div>
          </div>

          {/* Size options */}
          <div className="mt-5">
            <p className="mb-2 font-semibold">Size: {variant.size}</p>

            <div className="flex gap-5">
              {sizes.map((size) => (
                <Link
                  onClick={() => setIsProductLoading(true)}
                  href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${
                    variant.color
                  }&size=${size}`}
                  key={size}
                  className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${
                    size === variant.size ? "bg-primary text-white" : ""
                  }`}
                >
                  {size}
                </Link>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="mt-5">
            <p className="font-bold mb-2">Quantity</p>

            <div className="flex items-center h-10 border w-fit rounded-full">
              <button
                type="button"
                className="h-full w-10 flex justify-center items-center cursor-pointer"
                onClick={() => handleQty("dec")}
              >
                <HiMinus />
              </button>

              <input
                type="text"
                value={qty}
                className="w-14 text-center border-none outline-offset-0"
                readOnly
              />

              <button
                type="button"
                className="h-full w-10 flex justify-center items-center cursor-pointer"
                onClick={() => handleQty("inc")}
              >
                <HiPlus />
              </button>
            </div>
          </div>

          {/* Add To Cart / Go To Cart */}
          {!addedIntoCart ? (
            <div className="mt-5">
              <ButtonLoading
                type="button"
                text="Add to cart"
                className="w-full rounded-full py-6 text-md cursor-pointer"
                onClick={handleAddToCart}
              />
            </div>
          ) : (
            <div className="mt-5">
              <Button asChild type="button">
                <Link
                  href={WEBSITE_CART}
                  className="w-full rounded-full py-6 text-md cursor-pointer bg-purple-900"
                >
                  Go to cart
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Product Details section */}
      <div className="mb-10">
        <div className="shadow rounded border">
          <div className="p-3 bg-gray-50 border-b">
            <h2 className="font-semibold text-2xl">Product Details</h2>
          </div>
          <div className="p-3">
            <div
              dangerouslySetInnerHTML={{ __html: encode(product.description) }}
            ></div>
          </div>
        </div>
      </div>
      {/* Rating & reviews section  */}
      <div className="mb-10">
        <ProductReview productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetails;
