import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { setProductDetails } from "@/store/user/product-slice";
import { addToCart, fetchCartItems } from "@/store/user/cart-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // const { cartItems } = useSelector((state) => state.userCart);
  // const { reviews } = useSelector((state) => state.userReview);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = fetchCartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    toast.promise(
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  // function handleAddReview() {
  //   toast.promise(
  //     dispatch(
  //       addReview({
  //         productId: productDetails?._id,
  //         userId: user?.id,
  //         userName: user?.userName,
  //         reviewMessage: reviewMsg,
  //         reviewValue: rating,
  //       })
  //     ).unwrap(),
  //     {
  //       loading: "Submitting your review...",
  //       success: (data) => {
  //         if (data?.success) {
  //           setRating(0);
  //           setReviewMsg("");
  //           dispatch(getReviews(productDetails?._id));
  //           return "Review added successfully!";
  //         }
  //         return "Review submission failed";
  //       },
  //       error: "Failed to submit review. Please try again.",
  //     }
  //   );
  // }

  // useEffect(() => {
  //   if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  // }, [productDetails]);

  // const averageReview =
  //   reviews && reviews.length > 0
  //     ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
  //       reviews.length
  //     : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-white rounded-xl shadow-2xl">
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
            <h1 className="text-3xl font-extrabold text-gray-800">{productDetails?.title}</h1>
            <p className="text-gray-600 text-lg mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through text-gray-500" : ""}`}>
                Rs.{productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-2xl font-bold text-gray-700">
                  Rs.{productDetails?.salePrice}
                </p>
              )}
            </div>
            {/* <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <StarIcon className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="text-muted-foreground">
                ({averageReview.toFixed(2)})
              </span>
            </div> */}
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
          <div className="max-h-48 overflow-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
            {/* <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                      </div>
                      <p className="text-gray-600">{reviewItem.reviewMessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-gray-500">No Reviews</h1>
              )}
            </div> */}

            {/* Add Review Section */}
            {/* <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
