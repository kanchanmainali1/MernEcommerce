import React, { useState, useEffect } from "react";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setProductDetails } from "@/store/user/product-slice";
import { addToCart, fetchCartItems } from "@/store/user/cart-slice";
import { addReview, getReviews } from "@/store/user/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.userReview); // ✅ FIXED

  function handleRatingChange(newRating) {
    setRating(newRating);
  }

  function handleAddToCart(productId, totalStock) {
    let currentCartItems = fetchCartItems.items || [];
    if (currentCartItems.length) {
      const index = currentCartItems.findIndex(
        (item) => item.productId === productId
      );
      if (index > -1) {
        const currentQuantity = currentCartItems[index].quantity;
        if (currentQuantity + 1 > totalStock) {
          toast.error(`Only ${currentQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    toast.promise(
      dispatch(
        addToCart({
          userId: user?.id,
          productId,
          quantity: 1,
        })
      ).unwrap(),
      {
        loading: "Adding to cart...",
        success: (data) => {
          if (data?.success) {
            dispatch(fetchCartItems(user?.id));
            return "Product added to cart";
          }
          return "Could not add product";
        },
        error: "Failed to add product. Try again.",
      }
    );
  }

  function handleAddReview() {
    if (!rating || reviewMsg.trim() === "") {
      toast.error("Please provide both a rating and a review message.");
      return;
    }

    toast.promise(
      dispatch(
        addReview({
          productId: productDetails?._id,
          userId: user?.id,
          userName: user?.userName,
          reviewMessage: reviewMsg,
          reviewValue: rating,
        })
      ).unwrap(),
      {
        loading: "Submitting your review...",
        success: (data) => {
          if (data?.success) {
            setRating(0);
            setReviewMsg("");
            dispatch(getReviews(productDetails?._id));
            return "Review added successfully!";
          }
          return "Review submission failed";
        },
        error: "Failed to submit review. Please try again.",
      }
    );
  }

  useEffect(() => {
    if (productDetails) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [dispatch, productDetails]);

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 max-w-[80vw] sm:max-w-[70vw] lg:max-w-[60vw] bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {productDetails?.title}
            </h1>
            <p className="text-gray-700 text-base mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p
                className={`text-3xl font-bold ${
                  productDetails?.salePrice > 0
                    ? "line-through text-gray-500"
                    : "text-primary"
                }`}
              >
                Rs.{productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-2xl font-bold text-gray-700">
                  Rs.{productDetails?.salePrice}
                </p>
              )}
            </div>
            <div className="mt-6">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed" disabled>
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                  onClick={() =>
                    handleAddToCart(productDetails?._id, productDetails?.totalStock)
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Reviews Section */}
          <div className="max-h-64 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
            <div className="space-y-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {reviewItem?.userName
                          ? reviewItem.userName.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{reviewItem?.userName}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < reviewItem.reviewValue ? "text-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{reviewItem.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Write a Review */}
          <div className="mt-8 space-y-4">
            <Label className="text-lg font-semibold text-gray-800">Write a review</Label>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleRatingChange(i + 1)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={`w-6 h-6 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder="Write your review..."
              className="border border-gray-300 rounded-md px-4 py-2 mt-2"
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
              className="bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
