"use client";

import React from "react";
import Image from "next/image";
import loading from "@/public/assets/images/loading.svg";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <Image
        src={loading}
        alt="Loading..."
        width={100}
        height={100}
        priority
        className="animate-pulse"
      />
    </div>
  );
};

export default Loading;
