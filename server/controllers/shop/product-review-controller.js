const Product = require("../../models/Product");
const Order = require("../../models/Order");
const ProductReview = require("../../models/Review");
const addProductReview = async (req, res) => {
  try {
    const { productId, userId, username, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase this product to review",
      });
    }

    const existingReview = await ProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }
    const newReview = new ProductReview({
      productId,
      userId,
      username,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();
    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    
    
    await Product.findByIdAndUpdate(productId, { averageReview });
    res.json({ success: true, data: newReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};

module.exports = { addProductReview, getProductReviews };
