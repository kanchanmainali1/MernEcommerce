import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import AdminOrderDetailsView from "./AdminOrderDetailsView";

function AdminOrdersView() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const { orderList = [], orderDetails = null } = useSelector(
    (state) => state.adminOrder
  );

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // When an order is selected, fetch its details and open the dialog.
  useEffect(() => {
    if (selectedOrderId) {
      dispatch(getOrderDetailsForAdmin(selectedOrderId));
      setDetailsDialogOpen(true);
    }
  }, [selectedOrderId, dispatch]);

  function handleViewDetails(orderId) {
    setSelectedOrderId(orderId);
  }

  function handleDialogClose() {
    setDetailsDialogOpen(false);
    setSelectedOrderId(null);
    dispatch(resetOrderDetails());
  }

  return (
    <Card className="bg-white shadow-xl rounded-lg overflow-hidden border-0">
      {/* Card Header with no border */}
      <CardHeader className="p-4 bg-white border-0">
        <CardTitle className="text-gray-800 text-2xl font-bold">
          Orders Overview
        </CardTitle>
      </CardHeader>

      {/* Card Content - Table with horizontal row borders only */}
      <CardContent className="p-4 border-0">
        <Table
          className="min-w-full border-collapse"
          style={{ border: "none" }}
        >
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                Order ID
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                Date
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                Status
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                Total
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.length > 0 ? (
              orderList.map((order) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                >
                  <TableCell className="px-4 py-2 text-sm text-gray-800">
                    {order._id}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-800">
                    {order.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge
                      className={`py-1 px-3 text-xs font-semibold text-white rounded ${
                        order.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : order.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-800">
                    Rs.{order.totalAmount}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Button
                      onClick={() => handleViewDetails(order._id)}
                      className="bg-blue-600 text-white hover:bg-blue-700 rounded py-1 px-3 text-sm"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-gray-200">
                <TableCell
                  colSpan={5}
                  className="text-center py-4 text-gray-500"
                >
                  No Orders Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={detailsDialogOpen} onOpenChange={handleDialogClose}>
        {orderDetails && <AdminOrderDetailsView orderDetails={orderDetails} />}
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;
