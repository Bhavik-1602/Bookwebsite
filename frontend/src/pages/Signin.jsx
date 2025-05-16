import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../store/auth';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post('http://localhost:3000/api/v1/sign-in', values);
        toast.success('Signed in successfully!');

        localStorage.setItem('authToken', res.data.token);
        localStorage.setItem('userId', res.data.id);

        dispatch(login({ role: res.data.role }));
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Invalid email or password');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
