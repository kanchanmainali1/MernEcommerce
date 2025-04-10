import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "@/store/admin/product-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";

function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get products and orders from Redux store
  const { productList = [] } = useSelector((state) => state.adminProducts);
  const { orderList = [] } = useSelector((state) => state.adminOrder);

  // Compute dynamic metrics
  const totalProducts = productList.length;
  const totalOrders = orderList.length;
  const pendingOrders = orderList.filter(
    (order) => order.orderStatus === "pending"
  ).length;

  // Fetch products and orders when the component mounts
  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // Navigation handlers
  const goToProducts = () => {
    navigate("/admin/products");
  };
  const goToOrders = () => {
    navigate("/admin/orders");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Placeholder admin profile */}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-blue-600 font-bold">A</span>
            </div>
            <span className="text-white text-lg">Welcome, Admin</span>
          </div>
        </div>
      </header>

      {/* Overview Metrics Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800">{totalProducts}</h2>
            <p className="text-gray-600 mt-2 text-sm">Total Products</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800">{totalOrders}</h2>
            <p className="text-gray-600 mt-2 text-sm">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800">{pendingOrders}</h2>
            <p className="text-gray-600 mt-2 text-sm">Pending Orders</p>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Management Card */}
          <Card
            onClick={goToProducts}
            className="cursor-pointer bg-white rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-6 border-0"
          >
            <CardHeader className="border-0">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Product Management
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 border-0">
              <p className="text-gray-600 text-base">
                Manage your products, add new items, update details, and track performance.
              </p>
              <Button variant="outline" className="mt-6">
                Go to Products
              </Button>
            </CardContent>
          </Card>

          {/* Order Management Card */}
          <Card
            onClick={goToOrders}
            className="cursor-pointer bg-white rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-6 border-0"
          >
            <CardHeader className="border-0">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Order Management
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 border-0">
              <p className="text-gray-600 text-base">
                View orders placed by users, update order status, and review detailed information.
              </p>
              <Button variant="outline" className="mt-6">
                Go to Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
