"use client";
import WebsiteBreadcrumb from "@/components/application/website/WebsiteBreadcrumb";
import React from "react";
import UserPanelLayout from "../UserPanelLayout";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import { WEBSITE_ORDER_DETAILS } from "@/routes/WebsiteRoute";
import { useSelector } from "react-redux";

const breadCrumbData = {
  title: "Dashboard",
  links: [{ label: "Dashboard" }],
};

const MyAccount = () => {
  const { data: dashboardData } = useFetch("/api/dashboard/user");

  const cart = useSelector((state) => state.cart);
  
  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border-b">Dashboard</div>
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex items-center justify-center gap-5 border rounded p-3">
                <div>
                  <h4 className="font-semibold text-lg mb-1">Total Orders</h4>
                  <span className="font-semibold text-gray-500">{dashboardData?.data?.totalOrderCount}</span>
                </div>
                <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                  <HiOutlineShoppingBag className="text-white" size={25} />
                </div>
              </div>
              <div className="flex items-center justify-center gap-5 border rounded p-3">
                <div>
                  <h4 className="font-semibold text-lg mb-1">Items In Cart</h4>
                  <span className="font-semibold text-gray-500">{cart?.count}</span>
                </div>
                <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                  <IoCartOutline className="text-white" size={25} />
                </div>
              </div>
            </div>
            {/* Table of orders  */}
            <div className="mt-5 overflow-auto">
              <h4 className="text-lg font-semibold mb-3">Recent Orders</h4>
              {dashboardData?.data?.recentOrders?.length > 0 ? (
                <table className="w-full border rounded-lg overflow-auto">
                  <thead>
                    <tr>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Sr.No.
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Order id
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Total item
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {dashboardData.data.recentOrders.map((order, index) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        {/* Sr No */}
                        <td className="p-2 text-sm text-gray-700">
                          {index + 1}
                        </td>

                        {/* Order ID */}

                        <td className="p-2 text-sm text-gray-700">
                          <Link href={WEBSITE_ORDER_DETAILS(order._id)} className="underline hover:text-blue-500">
                            {order._id}
                          </Link>
                        </td>

                        {/* Total items */}
                        <td className="p-2 text-sm text-gray-700">
                          {order?.products?.length || 0}
                        </td>

                        {/* Final Amount */}
                        <td className="p-2 text-sm font-semibold text-gray-800">
                          Rs. {order.finalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // ✅ No order found card
                <div className="flex flex-col items-center justify-center w-full py-20 text-gray-500">
                  <div className="text-xl font-semibold mb-2">
                    No Orders Found
                  </div>
                  <p className="text-sm">You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default MyAccount;
