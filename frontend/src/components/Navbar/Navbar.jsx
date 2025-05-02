import React, { useState } from 'react';
import logo from '../../assets/download (6).jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { FaGripLines } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth'; // Import your logout action

const Navbar = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [mobileNav, setMobileNav] = useState('hidden');

  const toggleMobileNav = () => {
    setMobileNav(mobileNav === 'hidden' ? 'block' : 'hidden');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    navigate('/signin'); // Redirect after logout
  };

  const Links = [
    { title: 'Home', link: '/' },
    { title: 'All Books', link: '/all-books' },
    ...(isLoggedIn ? [
      { title: 'Cart', link: '/cart' },
      { title: 'Profile', link: '/profile' }
    ] : []),
  ];

  return (
    <>
      <nav className="z-50 relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img className="h-10 me-4" src={logo} alt="logo" />
          <h1 className="text-2xl font-semibold">BookHeaven</h1>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {Links.map((item, i) => (
              <Link
                to={item.link}
                className="hover:text-blue-500 transition-all duration-300"
                key={i}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Logout
              </button>
            )}
          </div>

          <button
            className="md:hidden text-white text-2xl hover:text-zinc-400"
            onClick={toggleMobileNav}
          >
            <FaGripLines />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`${mobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}
      >
        {Links.map((item, i) => (
          <Link
            to={item.link}
            className="text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition-all duration-300"
            key={i}
            onClick={toggleMobileNav}
          >
            {item.title}
          </Link>
        ))}

        {!isLoggedIn ? (
          <>
            <Link
              to="/signin"
              className="px-8 mb-8 py-2 text-3xl font-semibold border border-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300"
              onClick={toggleMobileNav}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-8 mb-8 py-2 text-3xl font-semibold bg-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300"
              onClick={toggleMobileNav}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              handleLogout();
              toggleMobileNav();
            }}
            className="px-8 mb-8 py-2 text-3xl font-semibold border border-red-500 rounded text-white hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
