import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Updated sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex flex-col flex-grow">
        <AdminHeader setOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto p-6 bg-white shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
