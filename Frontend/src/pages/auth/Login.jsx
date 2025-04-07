import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import CommonForm from '@/components/common/CommonForm';
import { loginFormControl } from '@/config';
import { loginUser } from '@/store/auth-slice';

const initialState = { email: '', password: '' };

function Login() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();
    toast.promise(
      dispatch(loginUser(formData)).unwrap(),
      {
        loading: 'Authenticating...',
        success: () => 'Login successful! Redirecting...',
        error: (error) => {
          if (error.includes("doesn't exist")) {
            return 'Email not registered! Please register first';
          }
          if (error.includes("Incorrect password")) {
            return 'Wrong password! Please try again';
          }
          return error || 'Login failed. Please try again';
        },
      }
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Sign in to Buyfinity</h1>
        <p className="text-sm text-gray-500">
          Sign in to your account and start shopping.
        </p>
      </div>

      {/* Form Section */}
      <CommonForm
        formControls={loginFormControl}
        formData={formData}
        setFormData={setFormData}
        buttonText="Sign In"
        onSubmit={onSubmit}
      />

      {/* Links Section */}
      <div className="flex flex-col sm:flex-row justify-between mt-4 text-sm text-gray-600">
        <Link className="hover:underline" to="/auth/forgot-password">
          Forgot password?
        </Link>
        <Link className="hover:underline mt-2 sm:mt-0" to="/auth/register">
          Don't have an account? <span className="text-indigo-600">Register</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;
