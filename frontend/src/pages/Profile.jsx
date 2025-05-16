import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import MobileNav from '../components/Profile/MobileNav';
import Loader from '../components/Loader/Loader';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // for notifications
import { Toaster } from 'react-hot-toast';
const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Token is missing. Please log in again.');
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/get-user-information',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Assuming backend returns: { user: { username, email, avatar } }
        setUserInfo(response.data.user || response.data);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || 'Failed to fetch user info.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo && !error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-900 text-white">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-900">
        <p className="text-red-500 text-xl text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-screen py-8 gap-4 text-white">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-full md:w-1/6">
        <Sidebar data={userInfo} />
      </div>
       <Toaster position="top-right" />
      {/* Mobile Navigation */}
      <div className="block md:hidden w-full">
        <MobileNav />
      </div>

      {/* Main Profile Content */}
      <div className="w-full md:w-5/6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
