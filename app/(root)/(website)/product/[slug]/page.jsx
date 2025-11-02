import axios from "axios";
import React from "react";
import ProductDetails from "./ProductDetails";

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = params;
  const { color, size } = searchParams;

  // ✅ Fix env var spelling
  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;

  // ✅ Append filters if exist
  if (color && size) {
    url += `?color=${color}&size=${size}`;
  }

  const { data: getProduct } = await axios.get(url);
  if (!getProduct.success) {
    return (
      <div className="flex justify-center items-center py-10">
        <h1 className="text-4xl font-semibold h-300">Data not found</h1>
      </div>
    );
  }

  const product = getProduct?.data?.products;
  const variant = getProduct?.data?.variant;
  const colors = getProduct?.data?.colors;
  const sizes = getProduct?.data?.sizes;
  const reviewCount = getProduct?.data?.reviewCount;

  return (
    <ProductDetails
      product={product}
      variant={variant}
      colors={colors}
      sizes={sizes}
      reviewCount={reviewCount}
    />
  );
};

export default ProductPage;
