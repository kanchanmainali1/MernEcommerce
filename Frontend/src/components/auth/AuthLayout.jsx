import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/pic7.jpg')" }} // Update with your desired image path
    >
      {/* Color overlay for blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500 to-purple-700 opacity-50"></div>

      {/* Centered card for the auth forms */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
