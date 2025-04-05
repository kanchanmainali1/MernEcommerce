import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./UserCartItemsContent";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
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
    <SheetContent className="sm:max-w-md p-6 space-y-6 bg-white shadow-xl rounded-lg">
      <SheetHeader className="border-b pb-4 mb-4">
        <SheetTitle className="text-2xl font-bold text-gray-800">Your Cart</SheetTitle>
      </SheetHeader>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item, index) => (
              <UserCartItemsContent key={index} cartItem={item} />
            ))
          : <p className="text-center text-gray-500">Your cart is empty.</p>}
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center py-4 border-t">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-lg text-green-600">Rs. {totalCartAmount.toFixed(2)}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/user/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full py-3 mt-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
      >
        Proceed to Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
