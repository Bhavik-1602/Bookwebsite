import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookCard = ({ data, favourite, onRemove }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleRemoveBook = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');
      await axios.put(
        'http://localhost:3000/api/v1/remove-book-from-favourites',
        { id: userId, bookid: data._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onRemove) onRemove(data._id);
    } catch (err) {
      console.error('Error removing book:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = () => {
    if (imageError) {
      return '  ';
    }
    if (data.url && data.url.trim() !== '') {
      return data.url;
    }
    return 'https://via.placeholder.com/300x400/e9ecef/495057?text=Book+Cover';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="group relative backdrop-blur-sm bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-slate-700/50 hover:border-purple-500/30 overflow-hidden w-full max-w-sm mx-auto transform hover:-translate-y-2 hover:rotate-1">
      {/* Animated background glow */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div> */}
      
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={getImageUrl()}
          alt={data.title || 'Book cover'}
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          onError={handleImageError}
        />

        {/* Dynamic overlay gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-all duration-500" /> */}
        
        {/* Animated particles overlay */}
        {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-300"></div>
        </div> */}

        {/* Enhanced favourite badge */}
        {favourite && (
          <div className="absolute top-3 right-3 animate-bounce">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl border-2 border-white/20 backdrop-blur-sm">
              <span className="mr-1 animate-pulse">💖</span>
              Favourite
            </div>
          </div>
        )}

        {/* Enhanced price badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl border border-white/20 backdrop-blur-sm transform hover:scale-110 transition-transform duration-300">
            <span className="mr-1">💰</span>
            ₹{data.price}
          </div>
        </div>

        {/* Floating elements */}
        {/* <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg animate-ping"></div>
        </div> */}
      </div>

      {/* Enhanced Content */}
      <div className="relative p-5 sm:p-6 bg-gradient-to-b from-transparent to-slate-900/50">
        {/* Subtle pattern overlay */}
        {/* <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 via-transparent to-blue-500"></div>
         */}
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3 leading-tight tracking-wide group-hover:from-purple-200 group-hover:to-cyan-200 transition-all duration-500">
            {truncateText(data.title, 40)}
          </h3>
          
          <div className="flex items-center mb-4 text-gray-300 hover:text-purple-300 transition-colors duration-300">
            <span className="text-lg mr-2 group-hover:animate-bounce">✨</span>
            <p className="text-sm sm:text-base font-medium">
              {truncateText(data.author, 30)}
            </p>
          </div>
          
          {data.description && (
            <p className="text-gray-400 hover:text-gray-300 text-sm mb-5 line-clamp-2 transition-colors duration-300 leading-relaxed">
              {truncateText(data.description, 80)}
            </p>
          )}

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            {/* Enhanced View Details Button */}
            <Link
              to={`/view-book--details/${data._id}`}
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:via-purple-500 hover:to-blue-500 text-white text-center py-3 px-5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group/btn"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="group-hover/btn:animate-spin">📖</span>
                View Details
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
            </Link>

            {/* Enhanced Remove Button */}
            {favourite && (
              <button
                onClick={handleRemoveBook}
                disabled={isLoading}
                className="flex-1 relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-red-600 hover:from-red-500 hover:via-pink-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 disabled:transform-none disabled:shadow-none group/btn flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <span className="group-hover/btn:animate-bounce text-lg">🗑️</span>
                    <span>Remove</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Enhanced Category Info */}
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-gradient-to-r from-transparent via-slate-600 to-transparent">
            {data.category && (
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-gray-300 px-4 py-2 rounded-full text-xs font-semibold border border-slate-600 hover:border-purple-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
                <span className="mr-1">🏷️</span>
                {data.category}
              </div>
            )}
          </div>
        </div>
      </div>

      
      {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>
      
  
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div> */}
    </div>
  );
};

export default BookCard;