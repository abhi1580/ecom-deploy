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
    <Card className="w-full max-w-[250px] sm:max-w-[280px] md:max-w-[300px] mx-auto rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
      {/* Product Image with Badge */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[180px] sm:h-[200px] object-cover rounded-t-md"
        />
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded-md shadow">
            Out of Stock
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs rounded-md shadow">
            {`Only ${product?.totalStock} left`}
          </Badge>
        ) : product.salePrice > 0 ? (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded-md shadow">
            Sale
          </Badge>
        ) : null}
      </div>

      {/* Product Details */}
      <CardContent className="p-3">
        {/* Title */}
        <h2 className="text-sm font-medium text-gray-800 truncate">
          {product.title.length > 18
            ? product.title.substring(0, 18) + "..."
            : product.title}
        </h2>

        {/* Category & Brand */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
          <span>{categoryOptionsMap[product.category]}</span>
          <span>{brandOptionsMap[product.brand]}</span>
        </div>

        {/* Pricing */}
        <div className="flex justify-between items-center mt-2">
          <span
            className={`text-sm ${
              product.salePrice > 0
                ? "line-through text-gray-400"
                : "text-gray-800"
            }`}
          >
            ₹{product.price}
          </span>
          {product.salePrice > 0 && (
            <span className="text-sm font-semibold text-green-600">
              ₹{product.salePrice}{" "}
              <span className="text-xs text-gray-500">
                ({discountPercentage}% OFF)
              </span>
            </span>
          )}
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="p-3 border-t flex flex-wrap gap-2 justify-between">
        <Button
          variant="outline"
          className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 text-xs"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          View
        </Button>
        {product?.totalStock === 0 ? (
          <Button className="flex-1 opacity-60 cursor-not-allowed px-3 py-1 text-xs">
            Out of Stock
          </Button>
        ) : (
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
          >
            Add
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;
