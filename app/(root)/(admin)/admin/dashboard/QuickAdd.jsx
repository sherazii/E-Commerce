import React from 'react'
import { ADMIN_CATEGORY_ADD, ADMIN_COUPON_ADD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD } from "@/routes/AdminPanelRoute";
import { LiaTshirtSolid } from "react-icons/lia";
import { BiCategory } from "react-icons/bi";
import { MdPermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import Link from 'next/link';

const QuickAdd = () => {
  return (
    <div className="mt-10 grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5 mx-auto  place-items-center">
      <Link href={ADMIN_CATEGORY_ADD}>
        <div className="h-24 md:w-55 w-80 border rounded-2xl p-2 flex items-center justify-between  shadow-md  bg-radial-[at_25%_75%] from-green-300 via-green-400 to-green-600">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg text-white">Add Category</h4>
          </div>
          <div className="">
            <span className="">
              <BiCategory  className="h-12 w-12 border shadow-md shadow-white border-white text-white p-2 rounded-full bg-green-500"/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={ADMIN_PRODUCT_ADD}>
        <div className="h-24 md:w-55 w-80 border rounded-2xl p-2 flex items-center justify-between  shadow-md bg-radial-[at_25%_75%] from-blue-300 via-blue-400 to-blue-600">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg text-white">Add Products</h4>
          </div>
          <div className="">
            <span className="">
              <LiaTshirtSolid  className="h-12 w-12 border shadow-md shadow-white border-white text-white p-2 rounded-full bg-blue-500"/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={ADMIN_COUPON_ADD}>
        <div className="h-24 md:w-55 w-80 border rounded-2xl p-2 flex items-center justify-between  shadow-md bg-radial-[at_25%_75%] from-yellow-400 via-yellow-400 to-yellow-600">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg text-white">Add Coupon</h4>
          </div>
          <div className="">
            <span className="">
              <RiCoupon2Line   className="h-12 w-12 border shadow-md shadow-white border-white text-white p-2 rounded-full bg-yellow-500"/>
            </span>
          </div>
        </div>
      </Link>
      <Link href={ADMIN_MEDIA_SHOW}>
        <div className="h-24 md:w-55 w-80 border rounded-2xl p-2 flex items-center justify-between  shadow-md bg-radial-[at_25%_75%] from-cyan-300 via-cyan-400 to-cyan-600">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg text-white">Upload Media</h4>
          </div>
          <div className="">
            <span className="">
              <MdPermMedia   className="h-12 w-12 border shadow-md shadow-white border-white text-white p-2 rounded-full bg-cyan-500"/>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default QuickAdd