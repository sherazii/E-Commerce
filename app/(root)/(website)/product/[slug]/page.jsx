import axios from "axios";
import React from "react";
import ProductDetails from "./ProductDetails";

export default async function ProductPage({ params, searchParams }) {

  // ✅ Await params and searchParams as required by Next.js
  const { slug } = await params;
  const { color, size } = await searchParams;

  console.log("Slug:", slug, "Color:", color, "Size:", size);

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;

  // ✅ Append filters dynamically
  const queryParams = new URLSearchParams();
  if (color) queryParams.append("color", color);
  if (size) queryParams.append("size", size);

  if (queryParams.toString()) url += `?${queryParams.toString()}`;

  const { data: getProduct } = await axios.get(url);

  if (!getProduct?.success) {
    return (
      <div className="flex justify-center items-center py-20">
        <h1 className="text-3xl font-semibold text-red-500">Product Not Found</h1>
      </div>
    );
  }

  const { products: product, variant, colors, sizes, reviewCount } = getProduct.data;

  return (
    <ProductDetails
      product={product}
      variant={variant}
      colors={colors}
      sizes={sizes}
      reviewCount={reviewCount}
    />
  );
}
