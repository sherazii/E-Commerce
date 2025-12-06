"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import FeatureProductBox from "./FeatureProductBox";

const FeaturedProduct = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get("/api/product/getFeaturedProduct");

        if (!data.success) {
          setError("Data not found");
        } else {
          setProductData(data);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="py-5 text-center">Loading featured products...</div>;
  }

  if (error) {
    return <div className="py-5 text-center text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="sm:text-4xl font-semibold text-2xl">Featured Products</h2>
        <Link
          href={""}
          className="flex items-center gap-2 underline underline-offset-4 hover:text-primary"
        >
          View All <IoIosArrowRoundForward />
        </Link>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2 place-items-center">
        {productData.success &&
          productData.data.map((product) => (
            <FeatureProductBox product={product} key={product?._id} />
          ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
