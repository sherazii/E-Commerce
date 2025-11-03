import Image from "next/image";
import React from "react";
import userIcon from "@/public/assets/images/user.png";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const ReviewList = ({ review }) => {
  // console.log(review);

  return (
    <div className="flex gap-5 border-b border-gray-200 pb-6 mb-6">
      <div className="w-[60px] shrink-0">
        <Image
          src={review?.avatar?.url || userIcon}
          width={55}
          height={55}
          alt="user icon"
          className="rounded-lg object-cover"
        />
      </div>

      <div className="flex-1">
        <h4 className="text-lg font-semibold">{review?.title}</h4>

        {/* Name & Date */}
        <p className="text-sm mt-1 text-gray-600">
          <span className="font-medium text-gray-900">
            {review?.reviewedBy}
          </span>
          {" — "}
          <span>{dayjs(review?.createdAt).fromNow()}</span>
        </p>

        {/* ⭐ Star Rating */}
        <div className="mt-2 text-yellow-500 flex gap-1">
          {Array.from({ length: review?.rating }).map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </div>

        <p className="mt-3 text-gray-700">{review?.review}</p>
      </div>
    </div>
  );
};

export default ReviewList;
