import {
  House,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  UserRound,
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {userViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer text-gray-700 hover:text-blue-600 transition-all"
          key={menuItem.id}
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
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative shadow-sm hover:shadow-md"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItems?.items?.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">{cartItems.items.length}</div>
          )}
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm cursor-pointer">
            <AvatarFallback className="bg-blue-600 text-white font-bold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-64 bg-white shadow-xl rounded-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="bg-gradient-to-r from-pink-500 to-purple-500 h-14 w-14 shadow-lg">
              <AvatarFallback className="text-white font-bold text-xl">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">{user?.userName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Button variant="outline" className="w-full py-2" onClick={() => navigate('/user/account')}>Account</Button>
              <Button variant="destructive" className="w-full py-2" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
function UserHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b">
      <div className="flex items-center justify-between px-4 h-16 md:px-6">
        <Link className="flex items-center gap-2 text-blue-600" to="/user/home">
          <House className="h-6 w-6" />
          <span className="font-bold text-2xl tracking-tight">Buyfinity</span>
        </Link>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default UserHeader;
