import {
  House,
  Menu,
  ShoppingCart,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { userViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./UserCartWrapper";
import { fetchCartItems } from "@/store/user/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(menuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      menuItem.id !== "home" &&
      menuItem.id !== "products" &&
      menuItem.id !== "search"
        ? { category: [menuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${menuItem.id}`))
      : navigate(menuItem.path);
  }

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 gap-4">
      {userViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          key={menuItem.id}
          className="cursor-pointer text-base font-semibold text-gray-800 hover:text-indigo-600 transition duration-300"
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.userCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-gray-100 transition shadow-sm"
        >
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {cartItems?.items?.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.items.length}
            </div>
          )}
        </Button>
        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems?.items || []} />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
            <AvatarFallback className="bg-purple-600 text-white font-bold">
              {user?.userName ? user.userName[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="end"
          className="w-64 p-6 bg-white shadow-xl rounded-lg border border-gray-200"
        >
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-14 w-14 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-xl">
              <AvatarFallback className="text-white font-bold text-xl">
                {user?.userName ? user.userName[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">
                {user?.userName || "User"}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full py-2"
                onClick={() => navigate("/user/account")}
              >
                Account
              </Button>
              <Button
                variant="destructive"
                className="w-full py-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function UserHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4 md:px-12">
        <Link
          to="/user/home"
          className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition"
        >
          <House className="h-6 w-6" />
          <span className="font-extrabold text-2xl tracking-tight">Buyfinity</span>
        </Link>
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white p-6">
            <MenuItems />
            <div className="mt-6">
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default UserHeader;
