import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader/Loader';

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
        // If response structure is like: { user: { username, email, avatar } }
        setUserInfo(response.data.user || response.data); // adjust if needed
        console.log(response.data);
      } catch (error) {
        setError('Failed to fetch user info. Please try again.');
        console.error(error.response?.data || error.message);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-screen py-8 gap-4 text-white">
      {!userInfo && !error ? (
        <div className='w-full h-[100vh] flex items-center justify-center'>
          <Loader />
        </div>
      ) : error ? (
        <div className='text-red-500 text-center w-full '>{error}</div>
      ) : (
        <>
          <div className='w-full md:w-1/6'>
            <Sidebar data={userInfo} />
          </div>
          <div className='w-full md:w-5/6'>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
