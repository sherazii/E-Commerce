"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderDetails = ({ params }) => {
  // Unwrap params (Next.js 15+)
  const unwrappedParams = React.use(params);
  const { orderid } = unwrappedParams;

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`/api/order/get/${orderid}`);

        if (!data.success) {
          setError(data.message || "Order not found");
        } else {
          setOrderData(data.data);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err.response?.status === 404
            ? "Order not found"
            : "Failed to fetch order. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderid) fetchOrder();
  }, [orderid]);

  if (loading) return <div className="p-5">Loading order details...</div>;
  if (error)
    return <div className="p-5 text-red-500 font-semibold">{error}</div>;
  if (!orderData) return <div className="p-5">No order data available.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg my-5">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Details</h1>

      {/* Shipping Address */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Shipping Address
        </h2>
        <table className="table-auto w-full border border-gray-300 rounded-md">
          <tbody>
            <tr className="bg-blue-50 border-b">
              <td className="px-4 py-2 font-medium">Name</td>
              <td className="px-4 py-2">{orderData.name}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Email</td>
              <td className="px-4 py-2">{orderData.email}</td>
            </tr>
            <tr className="bg-blue-50 border-b">
              <td className="px-4 py-2 font-medium">Phone</td>
              <td className="px-4 py-2">{orderData.phone}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Address</td>
              <td className="px-4 py-2">
                {orderData.city}, {orderData.state}, {orderData.country} -{" "}
                {orderData.pincode}
              </td>
            </tr>
            {orderData.landmark && (
              <tr className="bg-blue-50 border-b">
                <td className="px-4 py-2 font-medium">Landmark</td>
                <td className="px-4 py-2">{orderData.landmark}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Products Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Products
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300 rounded-md">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderData.products.map((p) => (
                <tr
                  key={p.variantId}
                  className="border-b hover:bg-green-50 transition-colors"
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img
                      src={p.media}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    {p.name}
                  </td>
                  <td className="px-4 py-2">{p.size}</td>
                  <td className="px-4 py-2">{p.color}</td>
                  <td className="px-4 py-2">{p.qty}</td>
                  <td className="px-4 py-2">
                    {p.sellingPrice.toLocaleString("en-PK", {
                      style: "currency",
                      currency: "PKR",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    {(p.qty * p.sellingPrice).toLocaleString("en-PK", {
                      style: "currency",
                      currency: "PKR",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">
          Order Summary
        </h2>
        <table className="table-auto w-full border border-gray-300 rounded-md">
          <tbody>
            <tr className="bg-purple-50 border-b">
              <td className="px-4 py-2 font-medium">Subtotal</td>
              <td className="px-4 py-2">
                {orderData.subtotal.toLocaleString("en-PK", {
                  style: "currency",
                  currency: "PKR",
                })}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Discount</td>
              <td className="px-4 py-2">
                {orderData.discount.toLocaleString("en-PK", {
                  style: "currency",
                  currency: "PKR",
                })}
              </td>
            </tr>
            <tr className="bg-purple-50 border-b">
              <td className="px-4 py-2 font-medium">Coupon Discount</td>
              <td className="px-4 py-2">
                {orderData.couponDiscount.toLocaleString("en-PK", {
                  style: "currency",
                  currency: "PKR",
                })}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-bold text-lg">Total</td>
              <td className="px-4 py-2 font-bold text-lg">
                {orderData.finalAmount.toLocaleString("en-PK", {
                  style: "currency",
                  currency: "PKR",
                })}
              </td>
            </tr>
            <tr className="bg-purple-50">
              <td className="px-4 py-2 font-medium">Order Status</td>
              <td className="px-4 py-2 capitalize">{orderData.orderStatus}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;
