import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";
import CommonForm from "../common/CommonForm";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleUpdateStatus(e) {
    e.preventDefault();
    const { status } = formData;

    toast.promise(
      dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status })),
      {
        loading: "Updating order status...",
        success: (data) => {
          if (data?.payload?.success) {
            dispatch(getOrderDetailsForAdmin(orderDetails?._id));
            dispatch(getAllOrdersForAdmin());
            setFormData(initialFormData);
            return data?.payload?.message || "Order status updated successfully.";
          }
          return "Failed to update order status.";
        },
        error:
          "Error updating order status. Please try again.",
      }
    );
  }

  return (
    <DialogContent className="max-w-2xl p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-700">Order ID</p>
            <Label className="bg-gray-200 p-2 rounded">
              {orderDetails?._id}
            </Label>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Order Date</p>
            <Label className="bg-gray-200 p-2 rounded">
              {orderDetails?.orderDate.split("T")[0]}
            </Label>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Total Amount</p>
            <Label className="bg-gray-200 p-2 rounded">
              Rs.{orderDetails?.totalAmount}
            </Label>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Payment Method</p>
            <Label className="bg-gray-200 p-2 rounded">
              {orderDetails?.paymentMethod}
            </Label>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Payment Status</p>
            <Label className="bg-gray-200 p-2 rounded">
              {orderDetails?.paymentStatus}
            </Label>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Order Status</p>
            <Label className="bg-gray-200 p-2 rounded">
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-yellow-500"
                } text-white rounded`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700">Order Details</p>
            <ul className="divide-y divide-gray-300">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
                orderDetails.cartItems.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>{item.title}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Rs.{item.price}</span>
                  </li>
                ))
              ) : (
                <li className="py-2">No items found.</li>
              )}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Shipping Info</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{user?.userName}</p>
              <p>{orderDetails?.addressInfo?.address}</p>
              <p>{orderDetails?.addressInfo?.city}</p>
              <p>{orderDetails?.addressInfo?.pincode}</p>
              <p>{orderDetails?.addressInfo?.phone}</p>
              <p>{orderDetails?.addressInfo?.notes}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Status"
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
