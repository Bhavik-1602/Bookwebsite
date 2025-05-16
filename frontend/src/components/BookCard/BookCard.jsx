import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookCard = ({ data, favourite, onRemove }) => {
  const handleRemoveBook = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');

      const response = await axios.put(
        'http://localhost:3000/api/v1/remove-book-from-favourites',
        { id: userId, bookid: data._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      if (onRemove) onRemove(data._id);
    } catch (err) {
      console.error('Error removing book:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <Link to={`/view-book--details/${data._id}`}>
        <div className="h-60 overflow-hidden">
          <img
            src={'http://localhost:3000' + data.url}

            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-white text-lg font-semibold line-clamp-1">{data.title}</h3>
          <p className="text-zinc-400 text-sm mb-2 line-clamp-1">By {data.author}</p>
          <p className="text-yellow-400 text-base font-bold">₹ {data.price}</p>
        </div>
      </Link>

      {favourite && (
        <div className="p-4 pt-0">
          <button
            onClick={handleRemoveBook}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors duration-200"
          >
            Remove From Favourites
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard;
