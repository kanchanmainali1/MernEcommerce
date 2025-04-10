import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import CommonForm from "../common/CommonForm";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  function handleUpdateStatus(e) {
    e.preventDefault();
    const { status } = formData;
    if (!status.trim()) {
      toast.error("Please select a status.");
      return;
    }

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
        error: "Error updating order status. Please try again.",
      }
    );
  }

  if (!orderDetails) return null;

  return (
    <DialogContent className="max-w-sm w-full bg-white rounded-lg shadow-lg mt-10 p-4">
      <div className="space-y-3">
        {/* Section: Order Info */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-2">Order Information</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-medium text-gray-600">Order ID</p>
              <Label className="bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm text-xs text-gray-800 block">
                {orderDetails?._id}
              </Label>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Order Date</p>
              <Label className="bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm text-xs text-gray-800 block">
                {orderDetails?.orderDate.split("T")[0]}
              </Label>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Total Amount</p>
              <Label className="bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm text-xs text-gray-800 block">
                Rs. {orderDetails?.totalAmount}
              </Label>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Payment Method</p>
              <Label className="bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm text-xs text-gray-800 block">
                {orderDetails?.paymentMethod}
              </Label>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Payment Status</p>
              <Label className="bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm text-xs text-gray-800 block">
                {orderDetails?.paymentStatus}
              </Label>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Order Status</p>
              <Label className="bg-gray-50 px-2 py-1 rounded border border-gray-200 shadow-sm inline-flex items-center">
                <Badge
                  className={`py-1 px-2 rounded text-xs font-semibold text-white ${
                    orderDetails?.orderStatus === "confirmed"
                      ? "bg-green-500"
                      : orderDetails?.orderStatus === "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </Label>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Section: Order Details & Shipping Info */}
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-2">Order Details</h3>
          <ul className="divide-y divide-gray-200 text-xs text-gray-700">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item, idx) => (
                <li key={idx} className="py-1 flex justify-between items-center">
                  <span className="font-medium">{item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Rs. {item.price}</span>
                </li>
              ))
            ) : (
              <li className="py-1 text-gray-500">No items found.</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-2">Shipping Info</h3>
          <div className="space-y-1 text-xs text-gray-600">
            <p>{orderDetails?.addressInfo?.address}</p>
            <p>{orderDetails?.addressInfo?.city}</p>
            <p>{orderDetails?.addressInfo?.pincode}</p>
            <p>{orderDetails?.addressInfo?.phone}</p>
            <p>{orderDetails?.addressInfo?.notes}</p>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Section: Update Order Status */}
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-2">Update Order Status</h3>
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
