import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CommonForm from "@/components/common/CommonForm";
import { registerFormControl } from "@/config";
import { registerUser } from "@/store/auth-slice";

const initialState = { userName: "", email: "", password: "" };

function Register() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    toast.promise(
      dispatch(registerUser(formData)).unwrap(),
      {
        loading: "Creating account...",
        success: () => {
          navigate("/auth/login");
          return "Account created successfully! Please login";
        },
        error: (error) => {
          if (error.includes("already registered")) {
            return "Email is already registered!";
          }
          return error || "Registration failed. Please try again";
        },
      }
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
        <p className="text-sm text-gray-500">
          Sign up to start shopping at Buyfinity.
        </p>
      </div>

      {/* Form Section */}
      <CommonForm
        formControls={registerFormControl}
        buttonText="Sign Up"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      {/* Links Section */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Already have an account?
          <Link className="ml-2 text-indigo-600 hover:underline" to="/auth/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
