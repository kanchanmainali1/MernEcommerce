import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  BadgeCheck,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  return (
    <nav className="mt-6 flex flex-col space-y-4">
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            navigate(item.path);
            if (setOpen) setOpen(false);
          }}
          className="flex items-center gap-3 px-4 py-2 cursor-pointer rounded hover:bg-blue-50 transition-colors"
        >
          {item.icon}
          <span className="text-base font-medium text-gray-700">{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-3">
              <SheetTitle className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                <ChartNoAxesCombined size={28} />
                Admin Panel
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-gray-200 p-6 shadow-lg">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 cursor-pointer mb-8"
        >
          <ChartNoAxesCombined size={28} />
          <span className="text-2xl font-bold text-indigo-600">Admin Panel</span>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
