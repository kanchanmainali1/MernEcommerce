import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner"; 
import { createNewOrder } from "@/store/user/order-slice";
import Address from "@/components/userpanel/Address";
import UserCartItemsContent from "@/components/userpanel/UserCartItemsContent";

function UserCheckout() {
  const { cartItems } = useSelector((state) => state.userCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIspaymentStart] = useState(false);
  const dispatch = useDispatch();

  const totalCartAmount = cartItems?.items?.reduce(
    (sum, currentItem) =>
      sum +
      ((currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) *
        currentItem?.quantity),
    0
  ) || 0;

  const handleInitiateEsewaPayment = async () => {
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
      paymentMethod: "esewa",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/esewa/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        setIspaymentStart(true);

        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.paymentUrl;

        const { totalAmount, transactionUUID, productCode, successUrl, failureUrl, signature } = data.data;

        const formData = {
          total_amount: totalAmount,
          transaction_uuid: transactionUUID,
          product_code: productCode,
          success_url: successUrl,
          failure_url: failureUrl,
          signature: signature,
          signed_field_names: "total_amount,transaction_uuid,product_code"
        };

        for (const key in formData) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = formData[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while processing your order. Please try again.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems?.items?.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">Rs. {totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateEsewaPayment} className="w-full">
              {isPaymentStart ? "Processing Esewa Payment..." : "Checkout with Esewa"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCheckout;
