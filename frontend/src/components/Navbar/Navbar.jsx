import React, { useState } from 'react';
import logo from '../../assets/download (6).jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth';

const Navbar = () => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    navigate('/signin');
  };

  const Links = [
    { title: 'Home', link: '/' },
    { title: 'All Books', link: '/all-books' },
    { title: role === 'admin' ? 'Admin Profile' : 'Profile', link: '/profile' },
    ...(isLoggedIn ? [{ title: 'Cart', link: '/cart' }] : []),
  ];

  return (
    <>
      <nav className="bg-zinc-900 text-white shadow-md px-6 py-4 flex items-center justify-between relative z-50">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 rounded-md" />
          <span className="text-2xl font-semibold tracking-wide">BookHeaven</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {Links.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="hover:text-yellow-400 transition duration-300 text-lg"
            >
              {item.title}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <Link
                to="/signin"
                className="px-4 py-1 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-zinc-900 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 bg-yellow-400 text-zinc-900 rounded hover:bg-yellow-300 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="md:hidden text-2xl text-yellow-300"
          aria-label="Toggle Menu"
        >
          {mobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-zinc-900 z-40 transform transition-transform duration-300 ease-in-out ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {Links.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="text-3xl text-white font-semibold hover:text-yellow-400 transition"
              onClick={() => setMobileNavOpen(false)}
            >
              {item.title}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <Link
                to="/signin"
                className="text-2xl border border-yellow-400 px-6 py-2 rounded hover:bg-yellow-400 hover:text-zinc-900 transition"
                onClick={() => setMobileNavOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-2xl bg-yellow-400 text-zinc-900 px-6 py-2 rounded hover:bg-yellow-300 transition"
                onClick={() => setMobileNavOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMobileNavOpen(false);
              }}
              className="text-2xl border border-red-500 text-white px-6 py-2 rounded hover:bg-red-500 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
