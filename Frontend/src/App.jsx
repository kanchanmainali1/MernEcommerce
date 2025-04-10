import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/adminpanel/AdminDashboard";
import AdminOrders from "./pages/adminpanel/AdminOrders";
import AdminProducts from "./pages/adminpanel/AdminProducts";
import AdminFeatures from "./pages/adminpanel/AdminFeatures";
import AdminLayout from "./components/adminpanel/AdminLayout";
import NotFound from "./pages/not-found/NotFound";
import UserLayout from "./components/userpanel/UserLayout";
import UserHome from "./pages/userpanel/UserHome";
import UserListing from "./pages/userpanel/UserListing";
import UserCheckout from "./pages/userpanel/UserCheckout";
import UserAccount from "./pages/userpanel/UserAccount";
import CheckAuth from "./components/common/CheckAuth";
import UnauthPage from "./pages/auth/UnauthPage";
import AuthLayout from "./components/auth/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import SearchProducts from "./pages/userpanel/SearchProducts";
import OrderSuccess from "./pages/userpanel/OrderSuccess";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading)
    return <Skeleton className="w-[600px] h-[600px] rounded-full" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        
        {/* User Routes */}
        <Route
          path="/user"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <UserLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<UserHome />} />
          <Route path="listing" element={<UserListing />} />
          <Route path="checkout" element={<UserCheckout />} />
          <Route path="account" element={<UserAccount />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        
        {/* Order Success Route */}
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
