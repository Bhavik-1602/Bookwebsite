import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth';

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();  // ✅ fixed typo
  const navigate = useNavigate();

  const isAdmin = data?.role === "admin";

  return (
    <div className='bg-zinc-800 p-4 rounded flex flex-col items-center justify-between h-full'>
      <div className='flex items-center flex-col justify-center'>
        <img
          src={data?.avatar || '/default-avatar.png'}
          alt="avatar"
          className='h-[10vh] rounded-full object-cover'
        />
        <p className='mt-3 text-xl text-zinc-100 font-semibold'>{data?.username}</p>
        <p className='mt-1 text-sm text-zinc-300'>{data?.email}</p>
        <div className='w-full mt-4 h-[1px] bg-zinc-500 hidden lg:block'></div>
      </div>

      <div className='w-full flex-col items-center justify-center hidden lg:flex'>
        {!isAdmin ? (
          <>
            <Link to="/profile" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-gray-800 rounded transition-all duration-300">
              Favourites
            </Link>
            <Link to="/profile/orderHistory" className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-gray-800 rounded transition-all duration-300">
              Order History
            </Link>
            <Link to="/profile/settings" className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-gray-800 rounded transition-all duration-300">
              Settings
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile/add-book" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-gray-800 rounded transition-all duration-300">
              Add Book
            </Link>
            <Link to="/profile" className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-gray-800 rounded transition-all duration-300">
              All Orders
            </Link>
          </>
        )}
      </div>

      <button
        className='bg-zinc-900 w-3/6 lg:w-full mt-4 lg:mt-0 text-white font-semibold flex items-center justify-center py-2 rounded hover:bg-emerald-400 hover:text-zinc-900 transition-all duration-300'
        onClick={() => {
          dispatch(logout());
          localStorage.clear();
          navigate("/");
        }}
      >
        Log Out <FaArrowRightToBracket className='ml-2' />
      </button>
    </div>
  );
};

export default Sidebar;
