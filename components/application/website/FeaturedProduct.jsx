import axios from "axios";
import Link from "next/link";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import FeatureProductBox from "./FeatureProductBox";

const FeaturedProduct = async () => {
  const { data: productData } = await axios(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/getFeaturedProduct`
  );
  

//   if (!productData) return null;  
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h2 className="sm:text-4xl font-semibold text-2xl">
          Featured Products
        </h2>
        <Link
          href={""}
          className="flex items-center gap-2 underline underline-offset-4 hover:text-primary"
        >
          View All <IoIosArrowRoundForward />
        </Link>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-1 sm:gap-10 gap-4 place-items-center">
        {!productData.success && (
          <>
            <div className="text-center py-5 col-span-4">Data not found</div>
          </>
        )}
        {productData.success &&
          productData.data.map((product) => (
            <FeatureProductBox product={product} key={product?._id}/>
          ))}
      </div>
    </>
  );
};

export default FeaturedProduct;
