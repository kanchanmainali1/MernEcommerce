import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Address from "@/components/userpanel/Address";
import UserCartItemsContent from "@/components/userpanel/UserCartItemsContent";
import { useNavigate } from "react-router-dom";

function UserCheckout() {
  const { cartItems } = useSelector((state) => state.userCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems?.items?.reduce(
      (sum, currentItem) =>
        sum +
        ((currentItem?.salePrice > 0
          ? currentItem?.salePrice
          : currentItem?.price) *
          currentItem?.quantity),
      0
    ) || 0;

  const handlePlaceOrderCOD = async () => {
    if (!cartItems?.items?.length) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    if (!currentSelectedAddress) {
      toast.error("Please select an address to proceed.");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: singleCartItem?.salePrice || singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "COD",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/user/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (data.success) {
        toast.success("Order placed successfully with Cash on Delivery.");
        navigate(`/order-success/${data.orderId}`);
      } else {
        console.error("Error Response Data:", data);
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error during order placement:", error);
      toast.error("An error occurred while processing your order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-[350px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout Banner"
          className="h-full w-full object-cover object-center filter brightness-75"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Checkout</h1>
        </div>
      </div>

      {/* Main Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address Section */}
          <div>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Order Summary Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Order</h2>
            <div className="space-y-4">
              {cartItems?.items?.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))}
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-700">Total</span>
                <span className="text-lg font-bold text-gray-700">Rs. {totalCartAmount}</span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={handlePlaceOrderCOD}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
              >
                Place Order (Cash on Delivery)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCheckout;
