import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import { useNavigate } from "react-router-dom";

const UserCartWrapper = ({ cartItems, setOpenCartDialog }) => {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems?.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Your Cart</DialogTitle>
      </DialogHeader>

      {/* Scrollable cart items container */}
      <div className="mt-4 space-y-4 max-h-[50vh] overflow-y-auto px-2">
        {cartItems?.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty</p>
        )}
      </div>

      {cartItems?.length > 0 && (
        <>
          {/* Total amount */}
          <div className="mt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalCartAmount.toFixed(2)}</span>
          </div>

          {/* Action buttons */}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenCartDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                navigate("/shop/checkout");
                setOpenCartDialog(false);
              }}
            >
              Checkout
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
};

export default UserCartWrapper;
