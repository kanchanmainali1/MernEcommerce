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
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/user/order-slice";
import UserOrderDetailsView from "./UserOrderDetailsView";

function UserOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.userOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-2xl font-semibold text-gray-800">Order History</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order ID</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order Date</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total Price</TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-medium text-gray-600">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow
                  key={orderItem._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-4 py-3 text-sm text-gray-700">{orderItem._id}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">
                    {orderItem?.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <Badge
                      className={`py-1 px-3 rounded-full text-xs font-semibold ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500 text-white"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">
                    Rs. {orderItem?.totalAmount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-center">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        View Details
                      </Button>
                      <UserOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default UserOrders;
