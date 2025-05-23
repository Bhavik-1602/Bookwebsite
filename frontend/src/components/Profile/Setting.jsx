import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';

const Setting = () => {
  const [Value, setValue] = useState({ address: '' });
  const [ProfileData, setProfileData] = useState();
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/get-user-information`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setValue({ address: response.data.address || '' });
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Update address
  const updateAddress = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3000/api/v1/update-address`, {
        id: userId,
        address: Value.address,
      }, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      alert("Address updated successfully!");
      fetchUserProfile(); // re-fetch updated data
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId, token]);

  return (
    <>
      {!ProfileData && <Loader />}
      {ProfileData && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Account Settings
              </h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Manage your profile information and preferences
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6"></div>
            </div>

            {/* Settings Card */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 px-8 py-6">
                  <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Information
                  </h2>
                  <p className="text-slate-400 mt-2">Update your account details below</p>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-8">
                  {/* Username Field */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <label className="text-slate-300 font-semibold text-lg">Username</label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm"></div>
                      <div className="relative bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          {ProfileData.username}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <label className="text-slate-300 font-semibold text-lg">Email Address</label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl blur-sm"></div>
                      <div className="relative bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                          {ProfileData.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Field */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <label htmlFor="address" className="text-slate-300 font-semibold text-lg">Delivery Address</label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-sm"></div>
                      <textarea
                        id="address"
                        rows="5"
                        placeholder="Enter your complete delivery address..."
                        className="relative w-full bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-4 font-semibold text-slate-200 placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 resize-none"
                        value={Value.address}
                        onChange={(e) => setValue({ ...Value, address: e.target.value })}
                      />
                    </div>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      This address will be used for all your order deliveries
                    </p>
                  </div>

                  {/* Update Button */}
                  <div className="pt-4">
                    <button
                      disabled={loading}
                      onClick={updateAddress}
                      className="group relative w-full overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating Address...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Update Address
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="mt-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-semibold mb-2">Account Security</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Your username and email cannot be changed for security reasons. 
                      If you need to update these details, please contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Setting;