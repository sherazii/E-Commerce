"use client";

import React, { useEffect, useState, use } from "react";
import useFetch from "@/hooks/useFetch";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import { ADMIN_DASHBOARD, ADMIN_ORDERS_SHOW } from "@/routes/AdminPanelRoute";
import Select from "@/components/application/Select";
import ButtonLoading from "@/components/application/ButtonLoading";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_ORDERS_SHOW, label: "Orders" },
  { href: "", label: "Order Details" },
];

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Unverified", value: "unverified" },
];

const OrderDetails = ({ params }) => {
  const unwrappedParams = use(params);
  const { orderid } = unwrappedParams;

  const [orderData, setOrderData] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');

  const { data, loading, error } = useFetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/${orderid}`
  );
  console.log(data);
  

  useEffect(() => {
    if (data?.success) {
      setOrderData(data.data);
      setOrderStatus(data.data.orderStatus);
    }
  }, [data]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading order details...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500 font-semibold">{error}</div>
    );

  if (!orderData)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          No order data available.
        </div>
      </div>
    );

  const formatCurrency = (value) =>
    value.toLocaleString("en-PK", {
      style: "currency",
      currency: "PKR",
    });

  const handleOrderStatus =async () => {
    setUpdatingStatus(true);
    try {
      const {data: response} = await axios.put('/api/order/update-status', {
        _id: orderData?._id,
        status: orderStatus
      })
      if(!response.success){
        throw new Error(response.message)
      }
      showToast('success', response.message)
      setUpdatingStatus(false);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-card shadow-lg rounded-lg my-5">
        <h1 className="text-3xl font-bold mb-6 text-center">Order Details</h1>

        {/* ✅ SHIPPING ADDRESS */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
            Shipping Address
          </h2>

          <div className="w-full overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
            <div className="min-w-max">
              <table className="table-auto w-full">
                <tbody>
                  {[
                    { label: "Name", value: orderData.name },
                    { label: "Email", value: orderData.email },
                    { label: "Phone", value: orderData.phone },
                    {
                      label: "Address",
                      value: `${orderData.city}, ${orderData.state}, ${orderData.country} - ${orderData.pincode}`,
                    },
                    orderData.landmark
                      ? { label: "Landmark", value: orderData.landmark }
                      : null,
                  ]
                    .filter(Boolean)
                    .map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b dark:border-gray-700 ${
                          index % 2 ? "bg-blue-50 dark:bg-gray-800/60" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-medium w-40">
                          {item.label}
                        </td>
                        <td className="px-4 py-3">{item.value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ✅ PRODUCTS TABLE */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-400">
            Products
          </h2>

          <div className="w-full overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
            <div className="min-w-max">
              <table className="table-auto w-full">
                <thead className="bg-green-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Color</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.products.map((p) => (
                    <tr
                      key={p.variantId}
                      className="border-b dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={p.media}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        {p.name}
                      </td>
                      <td className="px-4 py-3">{p.size}</td>
                      <td className="px-4 py-3">{p.color}</td>
                      <td className="px-4 py-3">{p.qty}</td>
                      <td className="px-4 py-3">
                        {formatCurrency(p.sellingPrice)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(p.qty * p.sellingPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ✅ ORDER SUMMARY */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-400">
            Order Summary
          </h2>

          <div className="w-full overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
            <div className="min-w-max">
              <table className="table-auto w-full">
                <tbody>
                  {[
                    {
                      label: "Subtotal",
                      value: formatCurrency(orderData.subtotal),
                    },
                    {
                      label: "Discount",
                      value: formatCurrency(orderData.discount),
                    },
                    {
                      label: "Coupon Discount",
                      value: formatCurrency(orderData.couponDiscount),
                    },
                    {
                      label: "Total",
                      value: formatCurrency(orderData.finalAmount),
                      bold: true,
                    },
                    {
                      label: "Order Status",
                      value: (
                        <>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-[12rem]">
                            <Select
                              className="w-full"
                              options={statusOptions}
                              selected={orderStatus}
                              setSelected={setOrderStatus}
                            />
                          </div>
                          <div className="my-3">
                            <ButtonLoading
                              type="button"
                              onClick={handleOrderStatus}
                              text="Save Status"
                              loading={updatingStatus}
                              className={'cursor-pointer'}
                            />
                          </div>
                        </>
                      ),
                    },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b dark:border-gray-700 ${
                        index % 2 ? "bg-purple-50 dark:bg-gray-800/60" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{item.label}</td>
                      <td className="px-4 py-3">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default OrderDetails;
