import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      address: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3, 'Min 3 characters').required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Required'),
      address: Yup.string().min(10, 'Min 10 characters').required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post('http://localhost:3000/api/v1/sign-up', values);
        toast.success('Registration successful!');
        navigate('/signin');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>

        <form onSubmit={formik.handleSubmit}>
          {['username', 'email', 'password', 'address'].map((field) => (
            <div className="mb-4" key={field}>
              <label htmlFor={field} className="block text-gray-700 font-medium mb-2 capitalize">
                {field}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                id={field}
                name={field}
                placeholder={`Enter your ${field}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field]}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  formik.touched[field] && formik.errors[field] ? 'border-red-500' : ''
                }`}
              />
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-600 text-sm mt-1">{formik.errors[field]}</div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
          >
            {formik.isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
