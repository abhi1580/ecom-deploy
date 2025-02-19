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
  return (
    <Card className={"w-full max-w-sm mx-auto"}>
      <div
        className="hover:cursor-pointer"
        onClick={() => {
          handleGetProductDetails(product?._id);
        }}
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge
              className={"absolute top-2 left-2 bg-red-500 hover:bg-red-600"}
            >
              Out of stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge
              className={"absolute top-2 left-2 bg-red-500 hover:bg-red-600"}
            >
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product.salePrice > 0 ? (
            <Badge
              className={"absolute top-2 left-2 bg-red-500 hover:bg-red-600"}
            >
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className={"p-4"}>
          <h2 className="text-xl mb-2  font-bold">{product.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${product.salePrice > 0 ? "line-through" : ""}
            text-lg font-semibold text-primary`}
            >
              ${product.price}
            </span>
            {product.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button
            className="w-full opacity-60 cursor-not-allowed"
            // onClick={() => {
            //   handleAddToCart(product?._id);
            // }}
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              handleAddToCart(product?._id, product?.totalStock);
            }}
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;
