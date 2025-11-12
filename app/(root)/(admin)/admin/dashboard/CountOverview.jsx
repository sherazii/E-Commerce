'use client'
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import React from "react";
import { CiUser } from "react-icons/ci";
import { IoBagHandle } from "react-icons/io5";
import { LiaTshirtSolid } from "react-icons/lia";
import { BiCategory } from "react-icons/bi";

const CountOverview = () => {
    const {data : count} =  useFetch('/api/dashboard/admin/count');
    
  return (
    <div className="mt-3 ">
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5 mx-auto  place-items-center">
      <Link href={""}>
        <div className="h-24 md:w-55 w-80 border rounded-2xl p-2 flex items-center  justify-between border-l-10 border-l-green-400 shadow-md dark:bg-gray-600 bg-white">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg text-gray-700 dark:text-gray-200">Total Categories</h4>
            <span className="text-xl font-bold">{count?.data?.category}</span>
          </div>
          <div className="">
            <span className="">
              <BiCategory  className="h-12 w-12 text-white p-2 rounded-full bg-green-500"/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={""}>
        <div className="h-24 md:w-55 w-80 border rounded-2xl p-2 flex items-center  justify-between border-l-10 border-l-blue-400 shadow-md dark:bg-gray-600 bg-white">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg text-gray-700 dark:text-gray-200">Total Products</h4>
            <span className="text-xl font-bold">{count?.data?.product}</span>
          </div>
          <div className="">
            <span className="">
              <LiaTshirtSolid   className="h-12 w-12 text-white p-2 rounded-full bg-blue-500"/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={""}>
        <div className="h-24 md:w-55 w-80 border rounded-2xl p-2 flex items-center  justify-between border-l-10 border-l-yellow-400 shadow-md dark:bg-gray-600 bg-white">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg text-gray-700 dark:text-gray-200">Total Customers</h4>
            <span className="text-xl font-bold">{count?.data?.customer}</span>
          </div>
          <div className="">
            <span className="">
              <CiUser    className="h-12 w-12 text-white p-2 rounded-full bg-yellow-500"/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={""}>
        <div className="h-24 md:w-55 w-80 border rounded-2xl p-2 flex items-center  justify-between border-l-10 border-l-cyan-300 shadow-md dark:bg-gray-600 bg-white">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg text-gray-700 dark:text-gray-200">Total Orders</h4>
            <span className="text-xl font-bold">{count?.data?.order}</span>
          </div>
          <div className="">
            <span className="">
              <IoBagHandle   className="h-12 w-12 text-white p-2 rounded-full bg-cyan-500"/>
            </span>
          </div>
        </div>
      </Link>
    </div>
    

    </div>
  );
};

export default CountOverview;
