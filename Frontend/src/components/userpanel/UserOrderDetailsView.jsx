import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function UserOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px] bg-white rounded-lg p-6 shadow-lg">
      <div className="grid gap-6">
        {/* Order Summary */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">Order ID</p>
            <Label className="bg-gray-100 text-gray-800 px-2 py-1 rounded">{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">Order Date</p>
            <Label className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {orderDetails?.orderDate.split("T")[0]}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">Order Price</p>
            <Label className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
              Rs. {orderDetails?.totalAmount}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">Payment Method</p>
            <Label className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {orderDetails?.paymentMethod}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">Payment Status</p>
            <Label className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {orderDetails?.paymentStatus}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 rounded-full text-xs font-semibold ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500 text-white"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Items */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium text-gray-800">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
                orderDetails.cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border-b border-gray-100 pb-2"
                  >
                    <span className="text-gray-700">Title: {item.title}</span>
                    <span className="text-gray-700">Qty: {item.quantity}</span>
                    <span className="text-gray-700">Price: Rs. {item.price}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No items found</li>
              )}
            </ul>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium text-gray-800">Shipping Info</div>
            <div className="grid gap-0.5 text-gray-600">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default UserOrderDetailsView;
