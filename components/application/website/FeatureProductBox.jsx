import Image from "next/image";
import React from "react";
import ImgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";

const FeatureProductBox = ({ product }) => {
  return (
    <Link
      href={WEBSITE_PRODUCT_DETAILS(product.slug) || ""}
      className="group block rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image Wrapper */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] overflow-hidden">
        <Image
          src={product?.media?.[0]?.secure_url || ImgPlaceholder}
          alt={product?.media?.[0]?.alt || product?.name || "Product Image"}
          fill
          priority={false}
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h4
          className="font-medium text-gray-900 text-base sm:text-lg truncate"
          title={product?.name}
        >
          {product?.name}
        </h4>

        <p className="flex items-center gap-3 mt-2 text-sm sm:text-base">
          <span className="line-through text-gray-400 font-light">
            PKR {product?.mrp?.toFixed(2)}
          </span>
          <span className="font-bold text-primary text-lg sm:text-xl">
            PKR {product?.sellingPrice?.toFixed(2)}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default FeatureProductBox;
