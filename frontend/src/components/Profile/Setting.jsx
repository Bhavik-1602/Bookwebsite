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
        <div className='h-[100%] p-0 md:p-4 text-zinc-100'>
          <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>Settings</h1>

          <div className='flex flex-col gap-4'>

            <div>
              <label htmlFor="">Username</label>
              <p className='p-2 rounded bg-zinc-800 mt-2 font-semibold'>
                {ProfileData.username}
              </p>
            </div>

            <div>
              <label htmlFor="">Email</label>
              <p className='p-2 rounded bg-zinc-800 mt-2 font-semibold'>
                {ProfileData.email}
              </p>
            </div>

            <div>
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                rows="5"
                placeholder='Address'
                className='p-2 rounded bg-zinc-800 mt-2 font-semibold'
                value={Value.address}
                onChange={(e) => setValue({ ...Value, address: e.target.value })}
              />
            </div>

            <div className='mt-4 flex justify-end'>
              <button
                disabled={loading}
                onClick={updateAddress}
                className='bg-yellow-500 text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400 disabled:opacity-50'
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Setting;
