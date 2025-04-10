import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/user/home"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white rounded-md shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-700 mb-6">
          Your order has been placed successfully.
        </p>
        <p className="text-gray-700 font-semibold">
          Order ID: <span className="text-indigo-600">{orderId}</span>
        </p>
        <button
          onClick={handleGoHome}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
