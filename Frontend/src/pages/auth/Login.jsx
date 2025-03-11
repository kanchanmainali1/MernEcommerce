import CommonForm from '@/components/common/CommonForm'
import { loginFormControl } from '@/config'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
const initialState = { 
   email: '', 
   password: '', 
  }

function Login() {
  const[formData, setFormData]=useState(initialState)
  function onSubmit(e){
    e.preventDefault()
    console.log(formData)
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
    
  )
}

export default Login