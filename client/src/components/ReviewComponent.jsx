import React from "react";
import FiveStartFeedback from "./FiveStartFeedback";

export default function ReviewComponent({ review, title }) {
  return (
    <div className="w-full px-3 py-2 bg-slate-100 rounded-lg">
      <div className="flex flex-row justify-between items-center pb-2">
        <div className="flex flex-col">
          <h1 className="font-bold">{review.owner.name}</h1>
          <FiveStartFeedback size={12} rating={review.rating} />
        </div>
        <h3>{review.createdAt.split("T")[0]}</h3>
      </div>

      <h2 className="font-bold">{title}</h2>
      <p>{review.content}</p>
    </div>
  );
}
