"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import imgNotFound from "@/public/assets/images/not-found.png";
import useFetch from "@/hooks/useFetch";
import { statusBadge } from "@/lib/helperFunction";

const LatestOrder = () => {
  const [latestOrder, setLatestOrder] = useState();
  const { data: orderData, loading } = useFetch(
    "/api/dashboard/admin/latest-order"
  );
  useEffect(() => {
    if (orderData && orderData.success) {
      setLatestOrder(orderData.data);
    }
  }, [orderData]);

  if (loading)
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );
  if (!orderData || orderData?.length === 0)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Image
          src={imgNotFound.src}
          height={imgNotFound.height}
          width={imgNotFound.width}
          className="w-20"
          alt="not-found-image"
        />
      </div>
    );
  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Id</TableHead>
            <TableHead>Total Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {latestOrder?.map((order) => (
            <TableRow
              key={order._id}
              className="hover:bg-gray-100 transition-all duration-300"
            >
              <TableCell className="py-3">{order._id}</TableCell>
              <TableCell className="py-3">{order.products.length}</TableCell>
              <TableCell className="py-3">
                {statusBadge(order.orderStatus)}
              </TableCell>
              <TableCell className="py-3 font-semibold">{order.finalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestOrder;
