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
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Enhanced Loading Screen */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-6">
            {/* Animated Profile Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            {/* Custom Loader Component */}
            <div className="space-y-4">
              <Loader />
              <div className="text-slate-300 text-lg font-medium">
                Loading your profile...
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Enhanced Error Screen */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-6 p-8">
            {/* Error Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            {/* Error Message */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm max-w-md mx-auto">
              <h2 className="text-red-400 text-xl font-bold mb-2">Authentication Error</h2>
              <p className="text-red-300 text-lg leading-relaxed">{error}</p>
            </div>
            
            {/* Action Button */}
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.5) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.5) 0%, transparent 50%)`,
        }}></div>
      </div>
      
      <div className="relative flex flex-col md:flex-row h-screen">
        {/* Enhanced Toaster */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(30, 41, 59, 0.95)',
              color: '#f1f5f9',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              backdropFilter: 'blur(12px)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />

        {/* Enhanced Sidebar - Desktop */}
        <div className="hidden md:block md:w-80 lg:w-96">
          <div className="h-full p-6">
            <div className="h-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Sidebar Header Gradient */}
              <div className="h-24 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm"></div>
              </div>
              
              {/* Sidebar Content */}
              <div className="relative -mt-12 h-full">
                <Sidebar data={userInfo} />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className="block md:hidden">
          <div className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
            <div className="px-4 py-3">
              <MobileNav />
            </div>
          </div>
        </div>

        {/* Enhanced Main Profile Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="h-full p-4 md:p-6 lg:p-8">
              {/* Content Container */}
              <div className="h-full bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
                {/* Content Header Gradient */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                {/* Main Content Area */}
                <div className="h-full p-4 md:p-6 lg:p-8 overflow-y-auto">
                  <div className="h-full">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="fixed bottom-6 right-6 hidden md:flex flex-col gap-3">
        {/* Profile Status Indicator */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-full px-4 py-2 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;