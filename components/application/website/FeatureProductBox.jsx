import Image from "next/image";
import React from "react";
import ImgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";

const FeatureProductBox = ({ product }) => {
    
  return (
    <div className="border w-full rounded-2xl md:min-h-110 min-h-90 flex flex-col justify-between hover:shadow-xl transition-all duration-200 overflow-hidden">
      <Link href={''}><Image
        src={product?.media[0]?.secure_url || ImgPlaceholder.src}
        width={400}
        height={400}
        alt={product?.media?.alt || product?.name}
        title={product?.media?.title || product?.name}
        className="w-full md:h-90  h-70 rounded-2xl object-cover"
      />
      <div className="p-3">
        <h4 className="">{product?.name}</h4>
        <p className="flex items-center gap-4">
          <span className="line-through text-gray-400">PKR{product?.mrp.toFixed(2)}</span>
          <span className="">PKR &nbsp; {product?.sellingPrice.toFixed(2)}</span>
        </p>
      </div></Link>
    </div>
  );
};

export default FeatureProductBox;
