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
  ...(isLoggedIn && role !== 'admin' ? [{ title: 'Cart', link: '/cart' }] : []),
];

  return (
    <>
      <nav className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-2xl px-6 py-4 flex items-center justify-between relative z-50 backdrop-blur-sm border-b border-zinc-700/50">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-amber-400/5"></div>
        
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <img src={logo} alt="Logo" className="h-12 w-12 rounded-lg object-cover relative shadow-lg border border-zinc-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-yellow-100 to-amber-200 bg-clip-text text-transparent">
              BookHeaven
            </span>
            <span className="text-xs text-zinc-400 -mt-1">Discover • Read • Enjoy</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 relative z-10">
          {Links.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="relative group px-3 py-2 text-lg font-medium text-zinc-300 hover:text-yellow-100 transition-all duration-300"
            >
              <span className="relative z-10">{item.title}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-zinc-700">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signin"
                  className="group relative px-6 py-2 border-2 border-yellow-400/50 rounded-full text-yellow-100 hover:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="relative z-10 font-medium">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </Link>
                <Link
                  to="/signup"
                  className="group relative px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-zinc-900 rounded-full font-semibold hover:from-yellow-300 hover:to-amber-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
                >
                  <span className="relative z-10">Sign Up</span>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="group relative px-6 py-2 border-2 border-red-400/50 rounded-full text-red-300 hover:border-red-400 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <span className="relative z-10 font-medium">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="md:hidden relative z-10 p-2 text-2xl text-yellow-300 hover:text-yellow-100 transition-colors duration-300 bg-zinc-800/50 rounded-lg backdrop-blur-sm border border-zinc-700/50 hover:border-yellow-400/50"
          aria-label="Toggle Menu"
        >
          <div className={`transition-transform duration-300 ${mobileNavOpen ? 'rotate-180' : ''}`}>
            {mobileNavOpen ? <FaTimes /> : <FaBars />}
          </div>
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 z-40 transform transition-all duration-500 ease-in-out ${
          mobileNavOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        {/* Background decoration for mobile */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setMobileNavOpen(false)}
          className="absolute top-6 right-6 p-3 text-2xl text-yellow-300 hover:text-white transition-colors duration-300 bg-zinc-800/50 rounded-full backdrop-blur-sm border border-zinc-700/50"
        >
          <FaTimes />
        </button>

        <div className="flex flex-col items-center justify-center h-full gap-8 relative z-10 px-8">
          {/* Mobile logo */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <img src={logo} alt="Logo" className="h-16 w-16 rounded-xl object-cover shadow-xl border-2 border-yellow-400/30" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-100 to-amber-200 bg-clip-text text-transparent">
              BookHeaven
            </h2>
            <p className="text-zinc-400 text-sm mt-1">Your Literary Paradise</p>
          </div>

          {Links.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group relative text-2xl text-zinc-300 font-medium hover:text-yellow-100 transition-all duration-300 px-8 py-3 rounded-xl"
              onClick={() => setMobileNavOpen(false)}
              style={{ animationDelay: `${index * 100}ms`, animation: 'slideInRight 0.6s ease-out forwards' }}
            >
              <span className="relative z-10">{item.title}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </Link>
          ))}

          <div className="flex flex-col gap-4 mt-8">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signin"
                  className="group relative text-xl border-2 border-yellow-400/50 text-yellow-100 px-8 py-3 rounded-full hover:border-yellow-400 transition-all duration-300 text-center backdrop-blur-sm"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span className="relative z-10 font-medium">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </Link>
                <Link
                  to="/signup"
                  className="group relative text-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-zinc-900 px-8 py-3 rounded-full font-semibold hover:from-yellow-300 hover:to-amber-300 transition-all duration-300 text-center transform hover:scale-105 shadow-xl"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span className="relative z-10">Sign Up</span>
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileNavOpen(false);
                }}
                className="group relative text-xl border-2 border-red-400/50 text-red-300 px-8 py-3 rounded-full hover:border-red-400 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <span className="relative z-10 font-medium">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </button>
            )}
          </div>
        </div>

        {/* CSS for mobile animations */}
        <style jsx>{`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Navbar;