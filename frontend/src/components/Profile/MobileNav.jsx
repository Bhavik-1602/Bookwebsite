import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const MobileNav = () => {
  const role = useSelector((state) => state.auth.role);

  return (
    <div className='w-full flex flex-col items-center justify-center my-6 gap-3 lg:hidden'>
      {role === "user" && (
        <>
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold w-11/12 py-2 text-center hover:bg-gray-800 rounded transition-all duration-300"
          >
            Favourites
          </Link>

          <Link
            to="/profile/orderHistory"
            className="text-zinc-100 font-semibold w-11/12 py-2 text-center hover:bg-gray-800 rounded transition-all duration-300"
          >
            Order History
          </Link>

          <Link
            to="/profile/settings"
            className="text-zinc-100 font-semibold w-11/12 py-2 text-center hover:bg-gray-800 rounded transition-all duration-300"
          >
            Settings
          </Link>
        </>
      )}

      {role === "admin" && (
        <>
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold w-11/12 py-2 text-center hover:bg-gray-800 rounded transition-all duration-300"
          >
            All Orders
          </Link>

          <Link
            to="/profile/add-book"
            className="text-zinc-100 font-semibold w-11/12 py-2 text-center hover:bg-gray-800 rounded transition-all duration-300"
          >
            Add Book
          </Link>
        </>
      )}
    </div>
  );
};

export default MobileNav;
