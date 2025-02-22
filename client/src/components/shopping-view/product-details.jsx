import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/product-slice";
import { addReview, getReviews, resetReviews } from "@/store/shop/review-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "../ui/dialog";
import StarRatingComponent from "../common/star-rating";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    // console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    dispatch(resetReviews()); // Clear the reviews when closing
  }

  function handleAddReview() {
    if (!user) {
      toast({
        title: "You need to be logged in to write a review",
        variant: "destructive",
      });
      return;
    }

    const hasReviewed = reviews.some((review) => review.userId === user.id);

    if (hasReviewed) {
      toast({
        title: "You have already reviewed this product",
        variant: "destructive",
      });
      return;
    }
    console.log(cartItems);

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        username: user?.username,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      } else {
        toast({
          title: "Purchase this item to review!",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails?._id && reviews.length === 0) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails, dispatch, reviews.length]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-4xl w-full p-6 sm:p-8 rounded-lg shadow-xl bg-white max-h-[90vh] overflow-auto">
        {/* Product Details */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="md:w-1/3 flex-shrink-0">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {productDetails?.title}
            </h1>
            <p className="text-gray-600">{productDetails?.description}</p>

            {/* Price Section with Alignment Logic */}
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900">
                ₹{productDetails?.price}
              </p>

              {productDetails?.salePrice > 0 && (
                <p className="text-xl font-bold text-red-500">
                  ₹{productDetails?.salePrice}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRatingComponent isClickable={false} rating={averageReview} />
              <span className="text-gray-500">
                ({averageReview.toFixed(2)})
              </span>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-4">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full bg-gray-400 text-white cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-6" />

        {/* Customer Reviews */}
        <div className="max-h-[250px] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

          <div className="space-y-4">
            {reviews?.length > 0 ? (
              reviews.map((reviewItem, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>
                      {reviewItem?.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">
                      {reviewItem?.username}
                    </h3>
                    <StarRatingComponent
                      isClickable={false}
                      rating={reviewItem?.reviewValue}
                    />
                    <p className="text-gray-600 text-sm">
                      {reviewItem.reviewMessage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Write a Review */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <Label className="text-lg font-semibold">Write a Review</Label>
          <StarRatingComponent
            rating={rating}
            handleRatingChange={handleRatingChange}
          />
          <Input
            name="reviewMsg"
            value={reviewMsg}
            onChange={(event) => setReviewMsg(event.target.value)}
            placeholder="Share your thoughts..."
            className="p-2 border rounded-md mt-2"
          />
          <Button
            onClick={handleAddReview}
            disabled={reviewMsg.trim() === ""}
            className="w-full mt-3 bg-green-600 hover:bg-green-700 transition duration-300 disabled:opacity-50"
          >
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
