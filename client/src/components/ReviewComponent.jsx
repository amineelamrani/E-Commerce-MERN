import React from "react";
import FiveStartFeedback from "./FiveStartFeedback";

export default function ReviewComponent({ review, title }) {
  return (
    <div className="w-full px-3 py-2 bg-slate-100 rounded-lg">
      <div className="flex flex-row justify-between items-center pb-2">
        <div className="flex flex-col">
          <h1 className="font-bold text-xs sm:text-sm md:text-base">
            {review.owner.name}
          </h1>
          <FiveStartFeedback size={10} rating={review.rating} />
        </div>
        <h3 className="text-xs sm:text-sm md:text-base">
          {review.createdAt.split("T")[0]}
        </h3>
      </div>

      <h2 className="font-bold text-xs md:text-base">{title}</h2>
      <p className="text-xs sm:text-sm md:text-base text-gray-500">
        {review.content}
      </p>
    </div>
  );
}
