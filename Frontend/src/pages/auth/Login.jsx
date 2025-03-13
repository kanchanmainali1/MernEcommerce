import CommonForm from '@/components/common/CommonForm';
import { loginFormControl } from '@/config';
import { loginUser } from '@/store/auth-slice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const initialState = { 
  email: '', 
  password: '', 
};

function Login() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(e) {
    e.preventDefault();
    toast.promise(
      dispatch(loginUser(formData)).unwrap(),
      {
        loading: 'Authenticating...',
        success: (data) => {
          // Success message only - CheckAuth will handle redirection
          return 'Login successful! Redirecting...';
        },
        error: (error) => {
          if (error.includes("doesn't exist")) {
            return 'Email not registered! Please register first';
          }
          if (error.includes("Incorrect password")) {
            return 'Wrong password! Please try again';
          }
          return error || 'Login failed. Please try again';
        }
      }
    );
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Sign in to your account</h1>
        <p className='mt-2'>Don't have an account?
          <Link className='font-medium text-primary ml-2 hover:underline' to='/auth/register'>Register</Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControl}
        formData={formData}
        setFormData={setFormData}
        buttonText={'Sign In'} 
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default Login;