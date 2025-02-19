import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

const UserCartItemsContent = ({ cartItem }) => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];
      if (getCartItems.length) {
        const indexOfCurrentCartitem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );
        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;
        console.log(getCurrentProductIndex, getTotalStock);
        if (indexOfCurrentCartitem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartitem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} items can be added for this item`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }
    dispatch(
      updateCartItemQty({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: `${
            typeOfAction === "plus" ? "Added" : "Removed"
          } 1 item to cart`,
          variant: `${typeOfAction === "plus" ? "default" : "destructive"}`,
        });
      }
    });
  }
  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
      })
    ).then((data) => {
      toast({
        title: "Item deleted from cart",
        variant: "info",
      });
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem.image}
        alt={cartItem.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem.title} </h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            className="h-8 w-8 rounded-full"
            variant="outline"
            size="icon"
            disabled={cartItem?.quantity === 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem.quantity}</span>
          <Button
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
            className="h-8 w-8 rounded-full"
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ₹
          {(cartItem?.salePrice > 0
            ? cartItem?.salePrice
            : cartItem?.price * cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
};

export default UserCartItemsContent;
