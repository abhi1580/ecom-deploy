const express = require("express");
const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.get("/get/:userId", fetchCartItems);
cartRouter.put("/update-cart", updateCartItemQty);
cartRouter.delete("/:userId/:productId", deleteCartItem);

module.exports = cartRouter;
