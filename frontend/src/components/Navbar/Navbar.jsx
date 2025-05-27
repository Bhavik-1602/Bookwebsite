import React, { useState, useEffect } from 'react';
import logo from '../../assets/download (6).jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth';

const Navbar = () => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
   

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    navigate('/signin');
  };

  // Navigation links
  const Links = [
    { title: 'Home', link: '/' },
    { title: 'All Books', link: '/all-books' },
    { title: role === 'admin' ? 'Admin Profile' : 'Profile', link: '/profile' },
    ...(isLoggedIn && role !== 'admin' ? [{ title: 'Cart', link: '/cart' }] : []),
  ];

  // Debounce search input and fetch suggestions
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Fetch suggestions from your API
  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
  `${API_BASE_URL}/api/v1/all-books?search=${encodeURIComponent(query)}`
);
      const data = await response.json();
      setSuggestions(data.books || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
  };

  // When submitting search form
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/all-books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSuggestions([]);
      setMobileNavOpen(false);
    }
  };

  // When clicking on a suggestion item
  const handleSuggestionClick = (title) => {
    navigate(`/all-books?search=${encodeURIComponent(title)}`);
    setSearchQuery('');
    setSuggestions([]);
    setMobileNavOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-2xl px-6 py-4 flex items-center justify-between relative z-50 backdrop-blur-sm border-b border-zinc-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-amber-400/5"></div>

        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-12 rounded-lg object-cover relative shadow-lg border border-zinc-600"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-yellow-100 to-amber-200 bg-clip-text text-transparent">
              BookHeaven
            </span>
            <span className="text-xs text-zinc-400 -mt-1">Discover • Read • Enjoy</span>
          </div>
        </Link>

        {/* Desktop Search with Suggestions */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative z-10">
          <form onSubmit={handleSearchSubmit} className="w-full relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, genres..."
                className="w-full px-4 py-2.5 pl-12 pr-4 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-white placeholder-zinc-400 focus:outline-none focus:border-yellow-400/50 focus:bg-zinc-800/70 transition-all duration-300 backdrop-blur-sm"
                autoComplete="off"
              />
              <FaSearch className="absolute left-4 text-zinc-400 text-sm" />
              <button
                type="submit"
                className="absolute right-2 p-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-zinc-900 rounded-full hover:from-yellow-300 hover:to-amber-300 transition-all duration-300 transform hover:scale-105"
              >
                <FaSearch className="text-xs" />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="suggestions-list absolute bg-white text-black rounded shadow-md w-full max-h-60 overflow-auto mt-1 z-50">
                {suggestions.map((book, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 hover:bg-yellow-200"
                    onClick={() => handleSuggestionClick(book.title)}
                  >
                    {book.title}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        {/* Desktop Links and Auth Buttons */}
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

        {/* Mobile Nav Toggle Button */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="md:hidden relative z-10 p-2 text-2xl text-yellow-300 hover:text-yellow-100 transition-colors duration-300 bg-zinc-800/50 rounded-lg backdrop-blur-sm border border-zinc-700/50 hover:border-yellow-400/50"
          aria-label="Toggle navigation menu"
        >
          {mobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 bg-zinc-900/90 backdrop-blur-sm flex flex-col p-6 pt-24 z-40 overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, genres..."
              className="w-full px-4 py-3 pl-12 pr-4 bg-zinc-800/80 border border-zinc-700 rounded-full text-white placeholder-zinc-400 focus:outline-none focus:border-yellow-400/50"
              autoComplete="off"
            />
            <FaSearch className="absolute left-4 top-3.5 text-zinc-400 text-lg" />
            <button
              type="submit"
              className="absolute right-3 top-3.5 p-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-zinc-900 rounded-full hover:from-yellow-300 hover:to-amber-300 transition transform hover:scale-110"
            >
              <FaSearch />
            </button>
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-white text-black rounded shadow-md max-h-60 overflow-auto z-50">
                {suggestions.map((book, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-3 hover:bg-yellow-200"
                    onClick={() => handleSuggestionClick(book.title)}
                  >
                    {book.title}
                  </li>
                ))}
              </ul>
            )}
          </form>

          {Links.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              onClick={() => setMobileNavOpen(false)}
              className="py-4 text-xl font-semibold text-yellow-100 hover:text-yellow-300 border-b border-yellow-400/20"
            >
              {item.title}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <Link
                to="/signin"
                onClick={() => setMobileNavOpen(false)}
                className="mt-6 py-3 px-6 border border-yellow-400 rounded-full text-yellow-100 text-center hover:bg-yellow-400 hover:text-zinc-900 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileNavOpen(false)}
                className="mt-4 py-3 px-6 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full text-zinc-900 text-center font-semibold hover:from-yellow-300 hover:to-amber-300 transition transform hover:scale-105"
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
              className="mt-6 py-3 px-6 border border-red-500 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
