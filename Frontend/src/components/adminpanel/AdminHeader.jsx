import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-400 to-blue-500 shadow-md">
      <Button onClick={() => setOpen(true)} className="block lg:hidden">
        <AlignJustify size={24} />
        <span className="sr-only">Open Sidebar</span>
      </Button>
      <div className="flex flex-grow justify-end">
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-blue-500 hover:bg-blue-100 font-semibold py-2 px-4 rounded"
        >
          <LogOut size={24} />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
