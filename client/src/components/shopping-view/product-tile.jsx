import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import React from "react";

const ShoppingProductTile = ({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) => {
  // Calculate discount percentage
  const discountPercentage =
    product.salePrice > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
      {/* Product Image with Badge */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[250px] sm:h-[280px] md:h-[300px] object-cover rounded-t-lg"
        />
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-md shadow-md">
            Out of Stock
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-md shadow-md">
            {`Only ${product?.totalStock} left`}
          </Badge>
        ) : product.salePrice > 0 ? (
          <Badge className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-md shadow-md">
            Sale
          </Badge>
        ) : null}
      </div>

      {/* Product Details */}
      <CardContent className="p-4 md:p-5">
        {/* Title */}
        <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
          {product.title.length > 20
            ? product.title.substring(0, 20) + "..."
            : product.title}
        </h2>

        {/* Category & Brand */}
        <div className="flex justify-between items-center text-xs md:text-sm text-gray-500 mt-2">
          <span>{categoryOptionsMap[product.category]}</span>
          <span>{brandOptionsMap[product.brand]}</span>
        </div>

        {/* Pricing */}
        <div className="flex justify-between items-center mt-3">
          <span
            className={`${
              product.salePrice > 0
                ? "line-through text-gray-400"
                : "text-gray-800"
            } text-base md:text-lg font-medium`}
          >
            ₹{product.price}
          </span>
          {product.salePrice > 0 && (
            <span className="text-base md:text-lg font-semibold text-green-600">
              ₹{product.salePrice}{" "}
              <span className="text-xs md:text-sm text-gray-500">
                ({discountPercentage}% OFF)
              </span>
            </span>
          )}
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="p-4 border-t flex flex-wrap gap-3 justify-between">
        <Button
          variant="outline"
          className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          View Details
        </Button>
        {product?.totalStock === 0 ? (
          <Button className="flex-1 opacity-60 cursor-not-allowed px-4 py-2">
            Out of Stock
          </Button>
        ) : (
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;
