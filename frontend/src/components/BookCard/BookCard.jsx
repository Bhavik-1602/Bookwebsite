import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const BookCard = ({ data, favourite, onRemove }) => {
  const handleRemoveBook = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");

      const response = await axios.put(
        "http://localhost:3000/api/v1/remove-book-from-favourites",
        {
          id: userId,
          bookid: data._id, // ✅ Correct field
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert ("Removed from favourites:", response.data);

      // ✅ Trigger UI update in parent
      if (onRemove) {
        onRemove(data._id);
      }
    } catch (err) {
      console.error("Error removing book:", err.response?.data || err.message);
    }
  };

  return (
    <div className=''>
      <Link to={`/view-book--details/${data._id}`}>
        <div className='bg-zinc-800 rounded p-4 hover:scale-105 transition-transform duration-300'>
          <div className='bg-zinc-900'>
            <img src={data.url} alt={data.title} className="w-full h-60 object-cover rounded" />
          </div>
          <h3 className="text-white mt-2 text-lg font-semibold">{data.title}</h3>
          <p className="text-zinc-400">By {data.author}</p>
          <p className="text-yellow-300 font-bold">₹ {data.price}</p>
        </div>
      </Link>

      {favourite && (
        <button
          className='bg-yellow-500 text-xl px-4 py-2 rounded border border-yellow-900 mt-2'
          onClick={handleRemoveBook}
        >
          Remove From Favourite
        </button>
      )}
    </div>
  );
};

export default BookCard;
