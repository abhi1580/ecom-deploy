import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

const StarRatingComponent = ({
  isClickable = true,
  rating,
  handleRatingChange,
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          className={`p-2 rounded-full transition-all duration-300 ${
            star <= rating
              ? "text-yellow-500 hover:text-yellow-400"
              : "text-gray-400 hover:text-yellow-500"
          } ${isClickable ? "" : "opacity-5"}`} // Make it visually disabled
          variant="ghost"
          size="icon"
          onClick={
            isClickable && handleRatingChange
              ? () => handleRatingChange(star)
              : undefined
          }
          disabled={!isClickable} // Prevents button interactions
        >
          <StarIcon
            className={`w-6 h-6 ${
              star <= rating
                ? "fill-yellow-500 stroke-yellow-500"
                : "fill-gray-300 stroke-gray-400"
            }`}
          />
        </Button>
      ))}
    </div>
  );
};

export default StarRatingComponent;
