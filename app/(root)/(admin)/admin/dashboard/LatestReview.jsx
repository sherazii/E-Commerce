"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/hooks/useFetch";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import imgNotFound from "@/public/assets/images/not-found.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import imagePlaceholder from "@/public/assets/images/img-placeholder.webp";

const LatestReview = () => {
  const [latestreview, setLatestReview] = useState([]);
  const { data: reviewData, loading } = useFetch(
    "/api/dashboard/admin/latest-review"
  );

  useEffect(() => {
    if (reviewData && reviewData.success) {
      setLatestReview(reviewData.data);
    }
  }, [reviewData]);

  if (loading)
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );

  if (!latestreview || latestreview.length === 0)
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
    <div className="p-4 w-full overflow-x-auto rounded-md border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {latestreview.map((review) => (
            <TableRow
              key={review._id}
              className="hover:bg-gray-100 transition-all duration-300"
            >
              <TableCell className="py-3 flex items-center gap-3">
                <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
                  <AvatarImage
                    src={
                      review?.product?.media?.[0]?.secure_url ||
                      imagePlaceholder.src
                    }
                  />
                </Avatar>

                <span className="line-clamp-1 text-xs md:text-base font-medium max-w-[130px] md:max-w-full">
                  {review?.product?.name || "Not found"}
                </span>
              </TableCell>

              <TableCell className=" flex gap-1 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`${
                      index < review.rating ? "text-yellow-500" : "text-gray-300"
                    } text-sm md:text-lg`}
                  />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestReview;
