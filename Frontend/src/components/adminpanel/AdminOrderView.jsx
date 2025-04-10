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
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import AdminOrderDetailsView from "./AdminOrderDetailsView";

function AdminOrdersView() {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const { orderList = [], orderDetails = null } =
    useSelector((state) => state.adminOrder || {});

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetailsForAdmin(orderId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setDetailsDialogOpen(true);
  }, [orderDetails]);

  return (
    <Card className="shadow-md rounded-lg overflow-hidden bg-white">
      <CardHeader className="bg-gray-100 p-4 border-b">
        <CardTitle className="text-gray-800 text-xl">All Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Order ID
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Date
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Status
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Total
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.length > 0 ? (
              orderList.map((order) => (
                <TableRow key={order._id} className="border-b">
                  <TableCell className="px-4 py-2 text-sm text-gray-800">
                    {order._id}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-800">
                    {order.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge
                      className={`py-1 px-3 text-xs ${
                        order.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : order.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      } text-white rounded`}
                    >
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-800">
                    Rs.{order.totalAmount}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Dialog
                      open={detailsDialogOpen}
                      onOpenChange={() => {
                        setDetailsDialogOpen(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(order._id)}
                        className="bg-gray-800 text-white hover:bg-gray-700 rounded py-1 px-3 text-sm"
                      >
                        View Details
                      </Button>
                      {orderDetails && (
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-4 text-gray-500">
                  No Orders Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
